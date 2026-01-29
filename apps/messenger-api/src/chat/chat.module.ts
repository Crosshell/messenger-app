import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MessageService } from './message.service';
import { WsExceptionFilter } from '../common/filters/ws-exception.filter';
import { ChatController } from './chat.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, MessageService, WsExceptionFilter],
})
export class ChatModule {}
