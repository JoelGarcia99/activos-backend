import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsString, Length } from "class-validator";
import { Roles } from "../entities/roles.enum";

/**
 * Must be accessed only by root users
 */
export class CreateUserDto {

  @IsString({ message: "El nombre no es válido" })
  @Transform((value) => value.value.trim())
  name: string;

  @IsEnum(
    Roles,
    {
      message: "El rol debe ser admin o user"
    }
  )
  role: string;

  @IsEmail({}, { message: "El email no es válido" })
  @Transform((value) => value.value.trim().toLowerCase())
  @Length(10, 400, {
    message: "El email debe tener entre 10 y 400 caracteres"
  })
  email: string;
}
