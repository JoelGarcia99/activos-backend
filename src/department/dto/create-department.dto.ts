import { IsString } from "class-validator";

export class CreateDepartmentDto {
  @IsString({ message: 'El nombre es requerido' })
  name: string;
}
