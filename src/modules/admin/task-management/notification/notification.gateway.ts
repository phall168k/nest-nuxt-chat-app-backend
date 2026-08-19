import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from 'src/common/constants/socket-event.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { In, Repository } from 'typeorm';
import { NotificationRedRequestDto } from './dto/notification-red-request.dto';
import { handleWsError } from 'src/common/utils/handle-socket-error.util';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credential: true,
  },
})
export class NotificationGateway {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(SOCKET_EVENTS.NOTIFICATION.IS_RED)
  async handleMessage(
    @ConnectedSocket() client: Socket, 
      // payload: NotificationRedRequestDto,
    ) {
    try {
      const userId = client.data.user.id;
      const notifications = await this.notificationRepository.find({
        where: {
          receiverId: userId,
          isRed: false,
        },
      });
      if (notifications.length === 0) {
        return [];
      }

      const notificationIds = notifications.map((item) => item.id);

      await this.notificationRepository.update(
        {
          id: In(notificationIds),
        },
        {
          isRed: true,
        },
      );

      return notifications.map((item) => ({
        ...item,
        isRead: true,
      }));
      
    } catch (error) {
      handleWsError(error);
    }
  }
}
