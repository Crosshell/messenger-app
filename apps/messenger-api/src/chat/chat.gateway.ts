import 'dotenv/config';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SendMessageDto } from './dto/send-message.dto';
import { EditMessageDto } from './dto/edit-message.dto';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WsExceptionFilter } from '../common/filters/ws-exception.filter';
import { MessageService } from './message.service';
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt-auth.guard';
import { CurrentWsUser } from '../auth/decorators/current-ws-user.decorator';
import { ChatService } from './chat.service';
import { MarkReadDto } from './dto/mark-read.dto';

@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
  },
})
@UseFilters(WsExceptionFilter)
@UseGuards(WsJwtAuthGuard)
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const token = this.extractToken(client);
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.getOrThrow('jwt.secret'),
      });

      client.data.userId = payload.sub;

      client.join(`user_${payload.sub}`);
    } catch (e) {
      client.disconnect();
    }
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @CurrentWsUser('sub') userId: string,
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: string,
  ): Promise<void> {
    await this.messageService.checkChatAccess(userId, chatId);
    client.join(`chat_${chatId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @CurrentWsUser('sub') userId: string,
    @MessageBody() dto: SendMessageDto,
  ): Promise<void> {
    const message = await this.messageService.saveMessage(userId, dto);
    this.server.to(`chat_${dto.chatId}`).emit('newMessage', message);

    const chatMembers = await this.chatService.getChatMembers(dto.chatId);
    const userRooms = chatMembers.map((member) => `user_${member.userId}`);

    this.server.to(userRooms).emit('chatListUpdate', message);
  }

  @SubscribeMessage('editMessage')
  async handleEditMessage(
    @CurrentWsUser('sub') userId: string,
    @MessageBody() dto: EditMessageDto,
  ): Promise<void> {
    const updatedMessage = await this.messageService.editMessage(userId, dto);
    const chatMembers = await this.chatService.getChatMembers(dto.chatId);

    const userRooms = chatMembers.map((member) => `user_${member.userId}`);

    this.server.to(userRooms).emit('messageUpdated', updatedMessage);
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @CurrentWsUser('sub') userId: string,
    @MessageBody() payload: { chatId: string; messageId: string },
  ): Promise<void> {
    const deletedMessage = await this.messageService.deleteMessage(
      userId,
      payload.messageId,
    );

    const chatMembers = await this.chatService.getChatMembers(payload.chatId);
    const userRooms = chatMembers.map((member) => `user_${member.userId}`);

    this.server.to(userRooms).emit('messageDeleted', {
      messageId: payload.messageId,
      chatId: payload.chatId,
      senderId: deletedMessage.senderId,
      isRead: deletedMessage.isRead,
    });
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @CurrentWsUser('sub') userId: string,
    @MessageBody() dto: MarkReadDto,
  ): Promise<void> {
    const readUntil = await this.messageService.markAsRead(userId, dto);

    if (!readUntil) return;

    this.server.to(`chat_${dto.chatId}`).emit('messagesRead', {
      chatId: dto.chatId,
      readerId: userId,
      readAt: readUntil.toISOString(),
    });
  }

  notifyChatDeleted(userRooms: string[], chatId: string) {
    this.server.to(userRooms).emit('chatDeleted', { chatId });
  }

  private extractToken(client: Socket): string | undefined {
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
