import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateUserDto) {

  @IsString()
  @IsOptional()
  oldPassword: string

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 1,
  }, {
    message: "La contraseña debe tener al menos 8 caracteres," +
      " 1 número, 1 simbolo, 1 mayúscula y 1 minúscula"
  })
  @IsOptional()
  password: string;
}
