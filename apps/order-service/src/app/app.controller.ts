import { Controller, Inject, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller('order')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka
  ) {}

  @Post('create')
  async getData() {
    const result = this.appService.getData();
    const message = {
      value: JSON.stringify({
        eventType: 'NewOrder',
        userId: 'user.id',
        username: 'user.username',
      }),
    };
    this.kafkaClient.emit('order-events', message);
    return result;
  }
}
