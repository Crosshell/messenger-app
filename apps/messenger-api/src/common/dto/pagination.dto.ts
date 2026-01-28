import { IsOptional, IsNumber, Min, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  @IsUUID()
  cursor?: string;
}
