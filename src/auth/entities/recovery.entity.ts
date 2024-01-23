
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Recovery")
export class Recovery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'recovery_code' })
  recoveryCode: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  expiresAt: Date;
}
