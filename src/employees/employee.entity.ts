import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type Gender = 'Male' | 'Female';
export type CivilStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 120, nullable: true })
  firstName: string;

  @Column({ length: 120, nullable: true, default: '' })
  middleName: string;

  @Column({ length: 120, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: Gender;

  @Column({ type: 'varchar', length: 20, nullable: true })
  civilStatus: CivilStatus;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: string; // YYYY-MM-DD

  @Index({ unique: true })
  @Column({ length: 50, nullable: true })
  employeeId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordHash: string;

  @Column({ type: 'varchar', length: 50, default: 'employee' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
