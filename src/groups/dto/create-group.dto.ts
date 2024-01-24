import { IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateSubgroupDto } from "./create-subgroup.dto";
import { Transform, Type } from "class-transformer";

export class CreateGroupDto {
  @IsString({ message: 'El nombre del grupo es requerido' })
  @Transform(({ value }) => value.trim().toUpperCase())
  name: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSubgroupDto)
  @IsOptional()
  subgroups?: CreateSubgroupDto[];
}
