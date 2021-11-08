import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class LoginDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class SwitchFavoriteDTO {
  @IsNotEmpty()
  apartmentId: string;
}
