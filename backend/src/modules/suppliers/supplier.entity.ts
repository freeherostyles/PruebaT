import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { SupplierType } from './supplier-type.enum';
import { SupplierStatus } from './supplier-status.enum';

@Entity({ name: 'suppliers' })
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: SupplierType, name: 'supplier_type' })
  supplierType: SupplierType;

  @Column({
    type: 'enum',
    enum: SupplierStatus,
    default: SupplierStatus.ACTIVE,
  })
  status: SupplierStatus;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'first_name' })
  firstName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'last_name' })
  lastName: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'second_last_name',
  })
  secondLastName: string | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'business_name',
  })
  businessName: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'trade_name' })
  tradeName: string | null;

  @Column({ type: 'varchar', length: 13, unique: true })
  rfc: string;

  @Column({ type: 'varchar', length: 18, nullable: true })
  curp: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
    name: 'contact_person',
  })
  contactPerson: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date | null;
}
