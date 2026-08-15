import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SOCKET_EVENTS } from 'src/common/constants/socket-event.constant';

@WebSocketGateway({
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
})
export class UserStatusGateway 
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log('Socket connected', client.id);
    await this.handleStatusChanged(client, true);
  }

  async handleDisconnect(client: Socket) {
    await this.handleStatusChanged(client, false);
  }

  async handleStatusChanged(
   client: Socket,
   status: boolean,
  ) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) {
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload?.id;
      if (!userId) {
        console.log('USER NOT FOUND');
        return;
      }

      // Update datebase
      await this.userService.updateStatus(userId, status);

      // Notify all connected clients
      this.server.emit(SOCKET_EVENTS.USER.STATUS_CHANGE, {
        userId,
        status,
      });
      console.log(`User ${userId} is ${status ? 'ONELINE' : 'OFFLINE'}`);
    } catch (error) {
      console.log('Invalid socket token:', error);
    }
  }

}
