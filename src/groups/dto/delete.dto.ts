import { IsString } from "class-validator";

export class DeleteGroupDto {
  @IsString({ message: 'La contraseña es necesaria' })
  password: string;
}
