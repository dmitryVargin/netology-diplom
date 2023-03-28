import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'https';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { message, chatId } = body;
    client.to(chatId).emit('message', message);
  }
}
