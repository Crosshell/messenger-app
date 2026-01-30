import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Authorization } from '../auth/decorators/authorization.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat, Message } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ChatGateway } from './chat.gateway';
import { MessageService } from './message.service';

@Controller('chats')
@Authorization()
export class ChatController {
  constructor(
    private readonly service: ChatService,
    private readonly messageService: MessageService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async getOrCreateChat(
    @CurrentUser('sub') currentUserId: string,
    @Body() dto: CreateChatDto,
  ): Promise<Chat> {
    return this.service.getOrCreateChat(currentUserId, dto.targetUserId);
  }

  @Get()
  async getChats(
    @CurrentUser('sub') currentUserId: string,
    @Query() dto: PaginationDto,
  ) {
    return this.service.getUserChats(currentUserId, dto);
  }

  @Get(':chatId/messages')
  async getChatMessages(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Query() dto: PaginationDto,
  ): Promise<Message[]> {
    return this.messageService.getMessages(chatId, dto);
  }

  @Delete(':chatId')
  @HttpCode(HttpStatus.OK)
  async deleteChat(
    @CurrentUser('sub') currentUserId: string,
    @Param('chatId', ParseUUIDPipe) chatId: string,
  ) {
    const result = await this.service.deleteChat(currentUserId, chatId);

    const userRooms = result.members.map(({ userId }) => `user_${userId}`);

    this.chatGateway.notifyChatDeleted(userRooms, result.id);
  }
}
