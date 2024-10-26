import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: '*',
    credentials: true,
  },
  pingInterval: 10000, // Send pings every 10 seconds
  pingTimeout: 20000, // Disconnect if no response within 20 seconds
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) client.join(userId);
    console.log(`Client connected: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    const userId: any = client.handshake.query.userId;
    if (userId) client.leave(userId);
    console.log(`Client disconnected: ${userId}`);
  }

  sendNotificationToClient(clientId: string, event: string, message: any) {
    console.log('client notification send', clientId);
    // this.server.emit(event, message);
    this.server.to(clientId).emit(event, message);
  }

  sendNotification(event: string, message: any) {
    this.server.emit(event, message);
  }

  sendTestNotification() {
    this.server.emit('test-notification', {
      message: 'This is a test notification!',
    });
  }
}
