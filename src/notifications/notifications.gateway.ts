import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger: Logger = new Logger(NotificationsGateway.name);

  @WebSocketServer() server: Server;
  private users: { [key: string]: Socket } = {};

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    delete this.users[client.id];
  }

  @SubscribeMessage('subscribeToNotifications')
  subscribeToNotifications(client: Socket, userId: string) {
    this.users[userId] = client;
  }

  notifyUser(userId: string, notification: string) {
    const userSocket = this.users[userId];
    if (userSocket) {
      userSocket.emit('notification', notification);
    }
  }
}
