import { Controller, Get, Inject } from '@nestjs/common';

import { AppService } from './app.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('product-catalog')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka
  ) {}

  @Get('list')
  getData() {
    return this.appService.getData();
  }

  @MessagePattern('user-events')
  handleUserLoggedInEvent(@Payload() message) {
    this.appService.handleUserLoggedInEvent(message);
  }

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(`user-events`);
  }
}
