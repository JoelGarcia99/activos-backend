import { Department } from "src/department/entities/department.entity";
import { Subgroup } from "src/groups/entities/subgroup.entity";
import { Responsible } from "src/responsible/entities/responsible.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum AssetStatus {
  ACTIVE = 'ACTIVO',
  INACTIVE = 'INACTIVO',
}

@Entity('productsaf')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'modelo' })
  model: string;

  @Column()
  serie: string;

  @Column()
  price: number;

  @Column({ name: 'porcdep' })
  depreciationPercentage: number;

  @Column({ type: 'enum', enum: AssetStatus, default: AssetStatus.ACTIVE })
  status: AssetStatus;

  @Column({ name: 'fechac', type: 'date', nullable: true })
  purchaseDate?: Date;

  @Column()
  deletedAt?: Date;

  @Column({ name: 'userId' })
  responsibleId: number;

  @Column({ name: 'grupoafId' })
  subgroupId: number;

  @Column({ name: 'departamentoId' })
  departmentId: number;

  @ManyToOne(
    () => Department,
    (department) => department.assets,
    { eager: true },
  )
  @JoinColumn({ name: 'departamentoId' })
  department: Department;

  @ManyToOne(() => Responsible, (responsible) => responsible.assets, { eager: true })
  @JoinColumn({ name: 'userId' })
  responsible: Responsible;

  @ManyToOne(() => Subgroup, (subgroup) => subgroup.assets, { eager: true })
  @JoinColumn({ name: 'grupoafId' })
  subgroup: Subgroup;
}