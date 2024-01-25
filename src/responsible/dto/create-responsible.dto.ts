import { Transform } from "class-transformer";
import { IsString } from "class-validator";

export class CreateResponsibleDto {
  @IsString({ message: 'El nombre es requerido' })
  @Transform(({ value }) => value.trim().toUpperCase())
  name: string;
}
