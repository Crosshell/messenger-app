import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { AttachmentDto } from './attachment.dto';
import { Type } from 'class-transformer';

export class EditMessageDto {
  @IsString()
  @IsUUID()
  messageId: string;

  @IsString()
  @IsUUID()
  chatId: string;

  @IsString()
  @IsOptional()
  @Length(0, 3000)
  content: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}
