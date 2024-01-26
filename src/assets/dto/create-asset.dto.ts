import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { AssetStatus } from "../entities/asset.entity";

export class CreateAssetDto {
  @IsString({ message: "El nombre del activo es necesario" })
  name: string;

  @IsString({ message: "El modelo del activo es necesario" })
  model: string;

  @IsString({ message: "La serie del activo es necesario" })
  serie: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: "El precio del activo es necesario" })
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: "El porcentaje de depreciacion del activo es necesario" })
  depreciationPercentage: number;

  @IsEnum(AssetStatus, { message: "El estado del activo debe ser ACTIVO o INACTIVO" })
  status: AssetStatus;

  @IsDateString({}, { message: "La fecha de compra del activo no es válida" })
  @IsOptional()
  purchaseDate?: Date;

  @IsNumber({}, { message: "El ID del responsable del activo es necesario" })
  responsibleId: number;

  @IsNumber({}, { message: "El ID del subgrupo del activo es necesario" })
  subgroupId: number;

  @IsNumber({}, { message: "El ID del departamento del activo es necesario" })
  departmentId: number;
}
