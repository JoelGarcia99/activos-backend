import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { MaintenanceReason } from "../entities/reason.enum";

export class CreateMaintenanceDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: "El ID del responsable del activo es necesario" })
  responsibleId: number;

  @IsEnum(
    MaintenanceReason, {
    message: "El motivo del mantenimiento debe ser PREVENTIVO, CORRECTIVO, o " +
      "PREVENTIVO Y CORRECTIVO"
  }
  )
  reason: MaintenanceReason;

  @IsNumber({}, { message: "El ID del activo es necesario" })
  assetId: number;

}
