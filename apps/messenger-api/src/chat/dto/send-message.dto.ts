import { IsString, IsUUID, Length } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsUUID()
  chatId: string;

  @IsString()
  @Length(1, 3000)
  content: string;
}
