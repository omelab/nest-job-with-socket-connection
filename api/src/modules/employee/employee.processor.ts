import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Processor('employee-upload')
@Injectable()
export class EmployeeProcessor {
  constructor(
    private notificationsGateway: NotificationsGateway,
    private readonly employeeService: EmployeeService,
  ) {}

  @Process('upload')
  async handleUpload(job: Job) {
    // Get job-specific data from the job object
    const { clientId, employees } = job.data;

    // Simulate processing time
    console.log(`Processing upload job for client ${clientId}...`);

    await this.processEmployeeUpload(employees);

    // Once the job completes, send a notification to the specific client
    this.notificationsGateway.sendNotificationToClient(
      clientId,
      'jobComplete',
      {
        id: job.id,
        message: `Employee upload job ${job.id} complete`,
        data: {
          requestId: job.id,
        },
      },
    );
  }

  @Process('uploadAll')
  async handleUploadAll(job: Job) {
    const { employees } = job.data;
    await this.processEmployeeUpload(employees);
    // Once the job completes, notify the frontend
    this.notificationsGateway.sendNotification('jobComplete', {
      message: 'Employee upload complete',
      jobId: job.id,
    });
  }

  async processEmployeeUpload(employees: any[]) {
    for (const employeeData of employees) {
      await this.employeeService.addEmployee(employeeData);

      // Simulate individual processing of each employee
      console.log(`Processing employee: ${employeeData.name}`);
    }
  }
}
