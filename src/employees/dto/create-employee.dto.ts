import {
  IsEmail,
  IsOptional,
  IsIn,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MaxLength(120)
  firstName?: string;

  @IsOptional()
  @MaxLength(120)
  middleName?: string;

  @IsOptional()
  @MaxLength(120)
  lastName?: string;

  @IsOptional()
  @IsIn(['Male', 'Female'])
  gender?: 'Male' | 'Female';

  @IsOptional()
  @IsIn(['Single', 'Married', 'Divorced', 'Widowed'])
  civilStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string; // YYYY-MM-DD

  @IsOptional()
  @MaxLength(50)
  employeeId?: string;

  @IsOptional()
  @MinLength(6)
  @MaxLength(255)
  password?: string;
}
