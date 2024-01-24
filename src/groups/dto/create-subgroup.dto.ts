import { IsString } from "class-validator";

export class CreateSubgroupDto {
  @IsString({ message: 'El nombre del subgrupo es requerido' })
  name: string;
}
