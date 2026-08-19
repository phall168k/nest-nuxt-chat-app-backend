import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskEntity } from './entities/task.entity';
import { NotificationModule } from '../notification/notification.module';
import { TaskGateway } from './task.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity]),
    NotificationModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskGateway],
  exports: [TaskService],
})
export class TaskModule {}
