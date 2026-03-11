import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmployeesService } from '../employees/employees.service';
import { CreateEmployeeDto } from '../employees/dto/create-employee.dto';

@Injectable()
export class AuthService {
  constructor(
    private employees: EmployeesService,
    private jwt: JwtService,
  ) {}

  async register(dto: CreateEmployeeDto) {
    const employee = await this.employees.create(dto);
    return this.buildPublicEmployee(employee);
  }

  async login(email: string, password: string) {
    const employee = await this.employees.findByEmail(email);
    if (!employee) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, employee.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = await this.signToken(
      employee.id,
      employee.email,
      `${employee.firstName} ${employee.middleName} ${employee.lastName}`,
    );
    return { token, employee: this.buildPublicEmployee(employee) };
  }

  async getProfile(employeeId: string) {
    const employee = await this.employees.findById(employeeId);
    return this.buildPublicEmployee(employee);
  }

  async signToken(
    sub: string,
    email: string,
    name: string,
  ): Promise<string> {
    return await this.jwt.signAsync(
      { sub, email, name },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      },
    );
  }

  buildPublicEmployee(employee: any) {
    const {
      id,
      email,
      firstName,
      middleName,
      lastName,
      gender,
      civilStatus,
      dateOfBirth,
      employeeId,
      role,
      createdAt,
      updatedAt,
    } = employee;
    return {
      id,
      email,
      firstName,
      middleName,
      lastName,
      gender,
      civilStatus,
      dateOfBirth,
      employeeId,
      role,
      createdAt,
      updatedAt,
    };
  }
}
