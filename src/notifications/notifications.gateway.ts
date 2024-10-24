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
  @WebSocketServer() server: Server;
  private users: { [key: string]: Socket } = {};

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
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
