import { Transform } from "class-transformer";
import { IsString } from "class-validator";

export class CreateSubgroupDto {
  @IsString({ message: 'El nombre del subgrupo es requerido' })
  @Transform(({ value }) => value.trim().toUpperCase())
  name: string;
}
