import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResendVerificationDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
