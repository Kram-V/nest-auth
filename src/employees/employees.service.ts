import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(@InjectRepository(Employee) private repo: Repository<Employee>) {}

  async findAll(): Promise<Employee[]> {
    return this.repo.find({
      select: [
        'id',
        'email',
        'firstName',
        'middleName',
        'lastName',
        'gender',
        'civilStatus',
        'dateOfBirth',
        'employeeId',
        'createdAt',
        'updatedAt',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const emailLower = dto.email?.toLowerCase();

    if (emailLower) {
      const emailExists = await this.repo.findOne({
        where: { email: emailLower },
      });
      if (emailExists)
        throw new ConflictException('Employee email already exists');
    }

    if (dto.employeeId) {
      const employeeIdExists = await this.repo.findOne({
        where: { employeeId: dto.employeeId },
      });
      if (employeeIdExists)
        throw new ConflictException('Employee ID already exists');
    }

    const { password, ...data } = dto;
    const passwordHash = password ? await bcrypt.hash(password, 12) : undefined;

    const employee = this.repo.create({
      ...data,
      email: emailLower,
      passwordHash,
    });
    return this.repo.save(employee);
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return this.repo.findOne({ where: { email: email.toLowerCase() } });
  }

  async findById(id: string): Promise<Employee> {
    const employee = await this.repo.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.repo.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');

    if (dto.email && dto.email.toLowerCase() !== employee.email) {
      const emailTaken = await this.repo.findOne({
        where: { email: dto.email.toLowerCase() },
      });
      if (emailTaken)
        throw new ConflictException('Email already in use by another employee');
      employee.email = dto.email.toLowerCase();
    }

    if (dto.employeeId && dto.employeeId !== employee.employeeId) {
      const employeeIdTaken = await this.repo.findOne({
        where: { employeeId: dto.employeeId },
      });
      if (employeeIdTaken)
        throw new ConflictException(
          'Employee ID already in use by another employee',
        );
      employee.employeeId = dto.employeeId;
    }

    Object.assign(employee, {
      ...dto,
      email: employee.email,
      employeeId: employee.employeeId,
    });
    return this.repo.save(employee);
  }
}
