// user.gateway.ts
import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { User } from '@prisma/client'; // or your user interface




// @WebSocketGateway({
//   namespace: '/api/user', 
//   cors: {
//     origin: '*',
//   },
// })

@WebSocketGateway({
  transports: ['polling'], 
  // namespace: '/api/user', 
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
})

export class UserGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  // This method can be called by your service once a user is created
  @SubscribeMessage('userjoined')
  broadcastNewUser(user: any) {
    this.server.emit('userjoined', {
      msg: 'userjoined',
      body: {
        ...user,
        telegramId: user.telegramId.toString(),
      },
    });
  }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Client connected', socket.id);
    });
  }
}
