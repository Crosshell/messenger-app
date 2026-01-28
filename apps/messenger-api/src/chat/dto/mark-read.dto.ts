import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class MarkReadDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  chatId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  lastMessageId?: string;
}
