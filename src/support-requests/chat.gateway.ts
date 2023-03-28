import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { SupportRequestsService } from './support-requests.service';
import { NotFoundException } from '@nestjs/common';
import { Server } from 'https';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly supportRequestService: SupportRequestsService) {}

  @SubscribeMessage('subscribeToChat')
  async handleMessage(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const authorization = client.handshake.headers.authorization;
    if (!authorization) {
      return;
    }
    const token = authorization.replace(/Bearer /, '');
    const payload: any = jwt.verify(token, process.env.JWT_SECRET);
    const { role, id } = payload;
    if (!(role === 'manager' || role === 'client')) {
      return;
    }

    const supportRequest = await this.supportRequestService.findSupportRequest(
      chatId,
    );
    if (!supportRequest) {
      throw new NotFoundException();
    }

    if (role === 'client' && supportRequest.user !== id) {
      return;
    }

    client.join(chatId);
  }
}
