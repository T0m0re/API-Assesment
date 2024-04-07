import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDtoCreate {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class AuthDtoDelete {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class AuthUpdate {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
