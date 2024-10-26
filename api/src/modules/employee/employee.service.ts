import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as ExcelJS from 'exceljs';
import { validate } from 'class-validator';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Op } from 'sequelize';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee)
    private readonly employeeModel: typeof Employee,
    @InjectQueue('employee-upload') private employeeQueue: Queue,
  ) {}

  // Method to add a single employee
  async addEmployee(data: CreateEmployeeDto): Promise<Employee> {
    // Validate the DTO
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed: ${errors}`);
    }
    return this.employeeModel.create(data);
  }

  // Method to process bulk upload from Excel
  async processBulkUpload(filePath: string, clientId: string) {
    const employees = await this.parseExcelFile(filePath);
    await this.validateEmployees(employees);

    await this.employeeModel.destroy({
      where: {
        id: { [Op.ne]: null }, // Deletes all rows where id is not null
      },
      force: true,
    });

    await this.employeeQueue.add('upload', { clientId, employees });
  }

  // Method to process bulk upload from Excel
  async processUpload(filePath: string) {
    const employees = await this.parseExcelFile(filePath);
    await this.validateEmployees(employees);
    await this.employeeQueue.add('uploadAll', { employees });
  }

  private async parseExcelFile(filePath: string): Promise<CreateEmployeeDto[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];
    const employees: CreateEmployeeDto[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const rowValues: any = Array.isArray(row.values)
        ? row.values
        : Object.values(row.values);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, name, email, position, department] = rowValues;

      const employeeDto: any = new CreateEmployeeDto();
      employeeDto.name = name;
      employeeDto.email = typeof email === 'object' ? email.text : email;
      employeeDto.position = position;
      employeeDto.department = department;
      employees.push(employeeDto);
    });

    return employees;
  }

  private async validateEmployees(
    employees: CreateEmployeeDto[],
  ): Promise<void> {
    for (const [index, employeeDto] of employees.entries()) {
      const errors = await validate(employeeDto);
      if (errors.length > 0) {
        throw new BadRequestException(
          `Validation failed for row ${index + 2}: ${errors}`,
        );
      }
    }
  }
}
