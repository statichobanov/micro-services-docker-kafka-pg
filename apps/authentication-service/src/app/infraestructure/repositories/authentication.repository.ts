import { Inject } from '@nestjs/common';
import { AuthenticationIRepository } from '../../domain/authentication.i.repository';
import { ClientKafka } from '@nestjs/microservices';

export class AuthenticationRepository implements AuthenticationIRepository {
  constructor(
    @Inject(`KAFKA_CLIENT`)
    private readonly kafkaClient: ClientKafka
  ) {}
  authenticate(user) {
    this.kafkaClient.emit('user-events', user);
    return user;
  }
}
