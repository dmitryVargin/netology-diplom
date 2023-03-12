import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class MessageListener {
  @OnEvent('sendMessage')
  handleNewMessageEvent(event) {
    // handle and process "OrderCreatedEvent" event
    console.log(event);
  }
}
