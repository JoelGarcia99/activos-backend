import { IsAlphanumeric, IsDateString, IsEnum, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { AssetStatus } from "../entities/asset.entity";
import { Transform } from "class-transformer";
import { isFloat32Array } from "util/types";

export class CreateAssetDto {
  @IsString({ message: "El nombre del activo es necesario" })
  name: string;

  @IsString({ message: "El modelo del activo es necesario" })
  model: string;

  @IsString({ message: "La serie del activo es necesario" })
  serie: string;

  @IsString({
    message: "El precio del activo no es válido",
  })
  @Transform(({ value }) => {
    // this is just for validation purposes
    if (Number.isNaN(Number(value))) {
      return Number.NaN;
    }
    return Number(value).toFixed(2);
  })
  price: number;

  @IsString({ message: "El porcentaje de depreciacion del activo es necesario" })
  @Transform(({ value }) => {
    // this is just for validation purposes
    if (Number.isNaN(Number(value))) {
      return Number.NaN;
    }
    return Number(value).toFixed(2);
  })
  depreciationPercentage: number;

  @IsEnum(AssetStatus, { message: "El estado del activo debe ser ACTIVO o INACTIVO" })
  status: AssetStatus;

  @IsDateString({}, { message: "La fecha de compra del activo no es válida" })
  @IsOptional()
  purchaseDate?: Date;

  @IsString({ message: "El ID del responsable del activo es necesario" })
  @Transform(({ value }) => {
    // this is just for validation purposes
    if (Number.isNaN(Number(value))) {
      return Number.NaN;
    }
    return value;
  })
  responsibleId: number;

  @IsString({ message: "El ID del subgrupo del activo es necesario" })
  @Transform(({ value }) => {
    // this is just for validation purposes
    if (Number.isNaN(Number(value))) {
      return Number.NaN;
    }
    return value;
  })
  subgroupId: number;

  @IsString({ message: "El ID del departamento del activo es necesario" })
  @Transform(({ value }) => {
    // this is just for validation purposes
    if (Number.isNaN(Number(value))) {
      return Number.NaN;
    }
    return value;
  })
  departmentId: number;
}
