import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  @IsString()
  department: string;
}
