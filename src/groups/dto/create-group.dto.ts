import { IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateSubgroupDto } from "./create-subgroup.dto";

export class CreateGroupDto {
  @IsString({ message: 'El nombre del grupo es requerido' })
  name: string;

  @ValidateNested({ each: true })
  @IsOptional()
  subgroups?: CreateSubgroupDto[];
}
