import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type EmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  email: string;

  @Column({ length: 120 })
  firstName: string;

  @Column({ length: 120 })
  lastName: string;

  @Column({ length: 160, nullable: true })
  position?: string;

  @Column({ length: 160, nullable: true })
  department?: string;

  @Column({ type: 'date', nullable: true })
  hireDate?: string; // YYYY-MM-DD

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status: EmploymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
