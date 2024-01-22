import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Session } from "./session.entity";

@Entity('Usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombres' })
  name: string;

  @Column({ name: 'apellidos', nullable: true })
  lastName?: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'rol', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted?: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToOne(() => Session, (session) => session.user)
  session: Session;
}
