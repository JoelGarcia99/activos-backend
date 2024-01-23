import { Transform } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {

  @IsEmail({}, { message: "El correo no es válido" })
  @Transform((value) => value.value.trim().toLowerCase())
  email: string;

  @IsString({ message: "La contraseña es necesaria" })
  password: string;
}
