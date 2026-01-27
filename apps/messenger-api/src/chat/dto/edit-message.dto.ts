import { IsString, IsUUID, Length } from 'class-validator';

export class EditMessageDto {
  @IsString()
  @IsUUID()
  messageId: string;

  @IsString()
  @IsUUID()
  chatId: string;

  @IsString()
  @Length(1, 1024)
  content: string;
}
