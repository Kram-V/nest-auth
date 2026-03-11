import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employees: EmployeesService) {}

  // Get All Employees
  @Get()
  async findAll() {
    return this.employees.findAll();
  }

  // Get Employee by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employees.findById(id);
  }

  // Add Employee
  @Post()
  async create(@Body() dto: CreateEmployeeDto) {
    return this.employees.create(dto);
  }

  // Update Employee
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employees.update(id, dto);
  }
}
