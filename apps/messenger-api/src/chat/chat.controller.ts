import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Authorization } from '../auth/decorators/authorization.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from '@prisma/client';

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
  async getChats(@CurrentUser('sub') currentUserId: string): Promise<Chat[]> {
    return this.service.getUserChats(currentUserId);
  }
}
