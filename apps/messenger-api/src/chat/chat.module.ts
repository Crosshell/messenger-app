import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MessageService } from './message.service';
import { WsExceptionFilter } from '../common/filters/ws-exception.filter';

@Module({
  providers: [ChatGateway, ChatService, MessageService, WsExceptionFilter],
})
export class ChatModule {}
