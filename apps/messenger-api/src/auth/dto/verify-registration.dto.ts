import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class VerifyRegistrationDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  token: string;
}
