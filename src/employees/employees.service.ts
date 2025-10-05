import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(@InjectRepository(Employee) private repo: Repository<Employee>) {}

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const exists = await this.repo.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (exists) throw new ConflictException('Employee email already exists');

    const employee = this.repo.create({
      ...dto,
      email: dto.email.toLowerCase(),
    });
    return this.repo.save(employee);
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.repo.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');

    if (dto.email && dto.email.toLowerCase() !== employee.email) {
      const taken = await this.repo.findOne({
        where: { email: dto.email.toLowerCase() },
      });
      if (taken)
        throw new ConflictException('Email already in use by another employee');
      employee.email = dto.email.toLowerCase();
    }

    Object.assign(employee, { ...dto, email: employee.email });
    return this.repo.save(employee);
  }
}
