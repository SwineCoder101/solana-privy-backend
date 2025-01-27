// user.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { User } from '@prisma/client'; // or your user interface

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserGateway {
  @WebSocketServer()
  server: Server;

  // This method can be called by your service once a user is created
  broadcastNewUser(user: string) {
    this.server.emit('userJoined', user);
  }
}
