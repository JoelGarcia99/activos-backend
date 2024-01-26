import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { AssetStatus } from '../entities/asset.entity';

export class UpdateAssetDto {
  @IsString({ message: "El nombre del activo es necesario" })
  @IsOptional()
  name: string;

  @IsString({ message: "El modelo del activo es necesario" })
  @IsOptional()
  model: string;

  @IsString({ message: "La serie del activo es necesario" })
  @IsOptional()
  serie: string;

  @IsNumber({ maxDecimalPlaces: 2 }, {
    message: "El precio del activo no es válido",
  })
  @IsOptional()
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 }, {
    message: "El porcentaje de depreciacion del activo es necesario"
  })
  @IsOptional()
  depreciationPercentage: number;

  @IsEnum(AssetStatus, { message: "El estado del activo debe ser ACTIVO o INACTIVO" })
  @IsOptional()
  status: AssetStatus;

  @IsDateString({}, { message: "La fecha de compra del activo no es válida" })
  @IsOptional()
  purchaseDate?: Date;

  @IsNumber({}, { message: "El ID del responsable del activo es necesario" })
  @IsOptional()
  responsibleId: number;

  @IsNumber({}, { message: "El ID del subgrupo del activo es necesario" })
  @IsOptional()
  subgroupId: number;

  @IsNumber({}, { message: "El ID del departamento del activo es necesario" })
  @IsOptional()
  departmentId: number;
}
