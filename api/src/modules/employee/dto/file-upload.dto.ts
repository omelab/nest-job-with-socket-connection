// src/employee/dto/file-upload.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Express } from 'express';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Excel file to upload containing employee data',
  })
  @IsNotEmpty()
  file: Express.Multer.File;
}
