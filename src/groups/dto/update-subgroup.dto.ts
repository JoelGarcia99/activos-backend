import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateSubgroupDto {
  @IsNumber({})
  @IsOptional()
  id: number;

  @IsString({ message: 'El nombre del subgrupo es requerido' })
  @Transform(({ value }) => value.trim().toUpperCase())
  name: string;
}
