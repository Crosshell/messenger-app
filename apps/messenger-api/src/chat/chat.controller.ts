import {
  Body,
  Controller,
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

@Controller('chats')
@Authorization()
export class ChatController {
  constructor(private readonly service: ChatService) {}

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
    return this.service.getChatMessages(chatId, dto);
  }
}
