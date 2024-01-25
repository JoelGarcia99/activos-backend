import { IsString } from "class-validator";

/**
 * WARNING: So far it's also being used for Departments, be aware of that
 */
export class DeletionDto {
  @IsString({ message: 'La contraseña es necesaria' })
  password: string;
}
