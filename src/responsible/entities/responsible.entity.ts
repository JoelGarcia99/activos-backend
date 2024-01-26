import { Asset } from "src/assets/entities/asset.entity";
import { Maintenance } from "src/maintenance/entities/maintenance.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Responsable')
export class Responsible {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre', unique: true })
  name: string;

  @Column()
  isDeleted: boolean;

  @OneToMany(() => Asset, (asset) => asset.responsible)
  assets: Asset[];

  @OneToMany(() => Maintenance, (maintenance) => maintenance.responsible)
  maintenances: Maintenance[];
}
