
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateSubgroupDto } from "./create-subgroup.dto";
import { Type } from "class-transformer";

export class AddSubgroupDto {
  @IsNumber({}, { message: 'El ID del grupo es requerido' })
  groupId: number;

  @ValidateNested({ each: true })
  @Type(() => CreateSubgroupDto)
  @IsOptional()
  subgroups?: CreateSubgroupDto[];
}
