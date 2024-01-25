import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.entity";
import { Asset } from "src/assets/entities/asset.entity";

@Entity({ name: "Subgrupo" })
export class Subgroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre' })
  name: string;

  @Column({ name: "groupId", nullable: true })
  groupId?: number;

  @ManyToOne(() => Group, (group) => group.subgroups)
  group: Group;

  @OneToMany(() => Asset, (asset) => asset.subgroup)
  assets: Asset[];
}
