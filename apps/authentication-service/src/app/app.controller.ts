import { Controller, Inject, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka
  ) {}

  @Post()
  async authentication() {
    const result = this.appService.authentication();
    const message = {
      value: JSON.stringify({
        eventType: 'UserLoggedIn',
        userId: 'user.id',
        username: 'user.username',
      }),
    };
    this.kafkaClient.emit('user-events', message);
    return result;
  }
}
