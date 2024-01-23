import { IsString, IsStrongPassword } from "class-validator";

export class ChangePasswordDto {
  @IsString({ message: "El código de recuperación no es válido" })
  recoveryCode: string;

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 1
  }, { message: "La contraseña debe tener al menos 8 caracteres" })
  newPassword: string;
}
