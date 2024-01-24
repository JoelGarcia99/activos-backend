import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.entity";

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
}
