import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsUUID()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 50)
  password: string;
}
