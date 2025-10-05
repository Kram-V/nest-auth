import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MaxLength(120)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(120)
  lastName: string;

  @IsOptional()
  @MaxLength(160)
  position?: string;

  @IsOptional()
  @MaxLength(160)
  department?: string;

  @IsOptional()
  @IsDateString()
  hireDate?: string; // YYYY-MM-DD

  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE', 'ON_LEAVE'])
  status?: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
}
