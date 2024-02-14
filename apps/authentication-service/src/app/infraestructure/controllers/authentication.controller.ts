import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Authenticate } from '../../aplication/authenticate.service';
import { CreateUser } from '../../aplication/createUser.service';
import { VerifyToken } from '../../aplication/verifyToken.service';
import { SaveOrder } from '../../aplication/saveOrder.service';

@Controller()
export class AuthenticationController implements OnModuleInit {
  constructor(
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka,
    @Inject(Authenticate) private authenticate: Authenticate,
    @Inject(CreateUser) private createUser: CreateUser,
    @Inject(VerifyToken) private verifyToken: VerifyToken,
    @Inject(SaveOrder) private saveOrder: SaveOrder
  ) {}

  /**
   * Handles incoming Kafka messages on the 'user-events' topic.
   * @param message The payload of the message.
   */
  @MessagePattern('user-events')
  handleAuthenticate(@Payload() message) {
    Logger.log('Handling user-event message', { message });
    switch (message.type) {
      case 'login':
        return this.authenticate.run(message.data);
      case 'create-user':
        return this.createUser.run(message.data);
      case 'verify':
        return this.verifyToken.run(message.data);
    }
  }

  /**
   * Handles incoming order-related events.
   * @param message The payload of the message received from the 'order-events' topic.
   */
  @EventPattern('order-events')
  handleUpdateOrder(@Payload() message) {
    Logger.log('Handling order-event message', { message });
    switch (message.type) {
      case 'order-created':
        return this.saveOrder.run(message.data);
    }
  }

  /**
   * Subscribes to Kafka topics once the module is initialized.
   */
  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(`user-events`);
  }
}
