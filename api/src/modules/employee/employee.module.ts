import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee } from './entities/employee.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { BullModule } from '@nestjs/bull';
import { EmployeeProcessor } from './employee.processor';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Employee]),
    BullModule.registerQueue({
      name: 'employee-upload',
    }),
    NotificationsModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeProcessor],
})
export class EmployeeModule {}
