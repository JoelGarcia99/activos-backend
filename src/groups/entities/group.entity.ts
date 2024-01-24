import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subgroup } from "./subgroup.entity";

@Entity({ name: "gruposaf" })
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre' })
  name: string;

  @Column({ name: "ctagasto", nullable: true })
  ctagasto?: string;

  @Column({ name: "ctaacum", nullable: true })
  ctaacum?: string;

  @Column({ name: "empresa", type: "char", length: 2, default: "01" })
  companySerial: string;

  @Column({ name: "sucursal", type: "char", length: 2, default: "01" })
  sucursal: string;

  @Column({ name: "codgrupo", type: "char", length: 3, default: "001" })
  groupCode: string;

  @OneToMany(() => Subgroup, (subgroup) => subgroup.group, { eager: true })
  subgroups: Subgroup[];
}
