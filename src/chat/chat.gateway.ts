import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';

import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { SupportRequestsService } from '../support-requests/support-requests.service';
import { WsGuard } from '../auth/ws.guards';

// Что должно происходить
// 1)юзер открывает типо чат с тех поддержкой, в этот момент он отправляет
// message: subscribeToChat payload: chatId
// мы его подписываем на обновления сообщений, т.е когда дергается sendMessage,
// сокеты должны получить апдейт

const options = {
  handlePreflightRequest: (req, res) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, authorization, x-token',
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Max-Age': '1728000',
      'Content-Length': '0',
    };
    res.writeHead(200, headers);
    res.end();
  },
};

@WebSocketGateway(options)
export class ChatGateway {
  constructor(
    private readonly supportRequestsService: SupportRequestsService,
  ) {}

  @WebSocketServer()
  server: any;

  // @UseGuards(WsGuard)
  // @UseGuards(RolesGuard)
  // @Roles('client', 'manager')
  @SubscribeMessage('message')
  handleMessage(@MessageBody() body, @ConnectedSocket() client) {
    const { message, chatId } = body;
    client.to(chatId).emit('message', message);
  }
}
