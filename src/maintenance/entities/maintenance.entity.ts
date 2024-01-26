import { Asset } from "src/assets/entities/asset.entity";
import { Responsible } from "src/responsible/entities/responsible.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MaintenanceReason } from "./reason.enum";

@Entity('Mantenimiento')
export class Maintenance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "descripcion" })
  description: string;

  @Column({ name: "responsableId" })
  responsibleId: number;

  @Column({ name: "motivo", type: "enum", enum: MaintenanceReason })
  reason: string;

  @Column({ name: "fecha_solicitud" })
  requestDate: Date;

  @Column({ name: "productafId" })
  assetId: number;

  @ManyToOne(() => Asset, (asset) => asset.maintenances)
  @JoinColumn({ name: "productafId" })
  asset: Asset;

  @ManyToOne(() => Responsible, (responsible) => responsible.maintenances)
  @JoinColumn({ name: "responsableId" })
  responsible: Responsible;
}
