import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';

import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { Authenticate } from '../../aplication/authenticate.service';

@Controller()
export class AuthenticationController implements OnModuleInit {
  constructor(
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka,
    @Inject(Authenticate)
    private authenticate: Authenticate
  ) {}

  @EventPattern('user-events')
  handleAuthenticate(@Payload() message) {
    Logger.log({ message });
    this.authenticate.run(message);
  }

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(`user-events`);
  }
}
