import { Transform } from "class-transformer";
import { IsString } from "class-validator";

export class UpdateGroupDto {
  @IsString({ message: 'El nombre del grupo es requerido' })
  @Transform(({ value }) => value.trim().toUpperCase())
  name: string;
}
