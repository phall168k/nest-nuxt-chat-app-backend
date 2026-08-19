import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TaskService } from './task.service';
import { NotificationService } from '../notification/notification.service';
import { SOCKET_EVENTS } from 'src/common/constants/socket-event.constant';
import { CreateTaskRequestDto } from './dto/create-task-request.dto';
import { UpdateTaskSocketRequestDto } from './dto/update-task-socket-request.dto';
import { handleWsError } from 'src/common/utils/handle-socket-error.util';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credential: true,
  },
})
export class TaskGateway {
  constructor(
    private readonly taskService: TaskService,
    private readonly notificationService: NotificationService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(SOCKET_EVENTS.TASK.CREATE)
  async createTask(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateTaskRequestDto,
  ) {
    try {
      const userId = client.data.user.id;
      const task = await this.taskService.create(data, userId);
      const notification = await this.notificationService.create({
        senderId: task.createdByUserId,
        receiverId: task.assignToUserId,
        taskId: task.id,
        subject: `Assigned ${task.name} to you.`,
      });
      this.server
        .emit(SOCKET_EVENTS.TASK.CREATED, task);
      this.server
        .to(`user:${task.assignToUserId}`)
        .emit(SOCKET_EVENTS.NOTIFICATION.LIVE, notification);
    } catch (error) {
      handleWsError(error);
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.TASK.UPDATE)
  async updateTask(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UpdateTaskSocketRequestDto,
  ){
    try {
      const userId = client.data.user.id;
      const { id, ...dto } = data;

      const task = await this.taskService.update(id, dto);
        const notification = await this.notificationService.create({
          senderId: userId,
          receiverId: task.reportToUserId,
          taskId: task.id,
          subject: `Updated ${task.name}.`,
        });
        this.server
          .emit(SOCKET_EVENTS.TASK.UPDATED, task);
        this.server
          .to(`user:${task.reportToUserId}`)
          .emit(SOCKET_EVENTS.NOTIFICATION.LIVE, notification);    
    } catch (error) {
      handleWsError(error);
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.TASK.DELETE)
  async deleteTask(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { id: string },
  ) {
    try {
      const task = await this.taskService.findOne(data.id);
      if (!task) {
        throw new WsException({
          code: 'NOT_FOUND',
          message: 'Task not found',
        });
      }
      await this.taskService.remove(data.id);
      this.server
        .emit(SOCKET_EVENTS.TASK.DELETED, task);
    } catch (error) {
      handleWsError(error)
    }
  }

 
}
