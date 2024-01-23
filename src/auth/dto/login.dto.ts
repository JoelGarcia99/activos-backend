import { Transform } from "class-transformer";
import { IsString } from "class-validator";

export class LoginDto {

  @IsString({ message: "El nombre de usuario no es válido" })
  @Transform((value) => value.value.trim().toLowerCase())
  email: string;

  @IsString({ message: "La contraseña es necesaria" })
  password: string;
}
