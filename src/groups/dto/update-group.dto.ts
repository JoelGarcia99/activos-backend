// export class UpdateGroupDto {
//   @IsString({ message: 'El nombre del grupo es requerido' })
//   @Transform(({ value }) => value.trim().toUpperCase())
//   name: string;
// }


import { IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateSubgroupDto } from "./create-subgroup.dto";
import { Transform, Type } from "class-transformer";
import { UpdateSubgroupDto } from "./update-subgroup.dto";

export class UpdateGroupDto {
  @IsString({ message: 'El nombre del grupo es requerido' })
  @Transform(({ value }) => value.trim().toUpperCase())
  name: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateSubgroupDto)
  @IsOptional()
  subgroups?: UpdateSubgroupDto[];
}
