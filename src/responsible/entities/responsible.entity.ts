import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Responsable')
export class Responsible {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre', unique: true })
  name: string;

  @Column()
  isDeleted: boolean;
}
