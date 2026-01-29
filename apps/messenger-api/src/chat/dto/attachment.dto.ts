import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AttachmentDto {
  @IsString()
  url: string;

  @IsString()
  filename: string;

  @IsString()
  @IsOptional()
  mimeType?: string;

  @IsNumber()
  @IsOptional()
  size?: number;
}
