import { IsNotEmpty, IsString } from 'class-validator';

export class FindManyUsersDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
