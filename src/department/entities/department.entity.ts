import { Asset } from "src/assets/entities/asset.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "departamentos" })
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'empresa' })
  companyIdentifier: string;

  @Column({ name: 'sucursal' })
  branchIdentifier: string;

  @Column({ name: 'coddepar' })
  departmentCode: string;

  @Column({ name: 'nombre' })
  name: string;

  @OneToMany(() => Asset, (asset) => asset.department)
  assets: Asset[];
}
