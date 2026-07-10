import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Exclude()
  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    this.email = this.email.trim().toLowerCase();
  }
}
