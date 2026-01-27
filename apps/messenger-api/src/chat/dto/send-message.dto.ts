import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsUUID()
  chatId: string;

  @IsString()
  @Length(1, 1024)
  content: string;
}
