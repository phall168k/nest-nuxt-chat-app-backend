import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [TaskModule, NotificationModule],
})
export class TaskManagementModule {}
