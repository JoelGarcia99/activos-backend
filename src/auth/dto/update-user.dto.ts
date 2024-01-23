import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  oldPassword: string;

  @IsString({ message: "El nombre no es válido" })
  @Transform((value) => value.value.trim())
  @IsOptional()
  name: string;

  @IsString()
  @Transform((value) => value.value.trim())
  @IsOptional()
  lastName?: string;

  @IsEmail({}, { message: "El email no es válido" })
  @Transform((value) => value.value.trim().toLowerCase())
  @Length(10, 400, {
    message: "El email debe tener entre 10 y 400 caracteres"
  })
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
