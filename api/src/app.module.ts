// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { SequelizeModule } from '@nestjs/sequelize';
import { validationSchema } from './config/validation.schema';
import { EmployeeModule } from './modules/employee/employee.module';
import redisConfig from './config/redis.config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { NotificationsGateway } from './modules/notifications/notifications.gateway';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [appConfig, databaseConfig, redisConfig], // Ensure redisConfig is included here
      validationSchema,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.password'),
        },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    EmployeeModule,
  ],
  providers: [NotificationsGateway],
})
export class AppModule {}
