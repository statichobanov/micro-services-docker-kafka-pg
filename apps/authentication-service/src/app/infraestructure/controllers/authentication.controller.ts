import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';

import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { Authenticate } from '../../aplication/authenticate.service';
import { CreateUser } from '../../aplication/createUser.service';

@Controller()
export class AuthenticationController implements OnModuleInit {
  constructor(
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka,
    @Inject(Authenticate) private authenticate: Authenticate,
    @Inject(CreateUser) private createUser: CreateUser
  ) {}

  @MessagePattern('user-events')
  handleAuthenticate(@Payload() message) {
    Logger.log('Message', { message });
    switch (message.type) {
      case 'login':
        return this.authenticate.run(message.data);
      case 'create-user':
        return this.createUser.run(message.data);
    }
  }

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(`user-events`);
  }
}
