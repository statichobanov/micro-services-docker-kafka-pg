import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { Authenticate } from '../../aplication/authenticate.service';
import { AuthenticationRepository } from '../repositories/authentication.repository';
import { AuthenticationIRepository } from '../../domain/authentication.i.repository';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'authentication-service',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'authentication-service-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationRepository,
    {
      provide: Authenticate,
      useFactory(authenticationRepository: AuthenticationIRepository) {
        return new Authenticate(authenticationRepository);
      },
      inject: [AuthenticationRepository],
    },
  ],
})
export class AuthenticationModule {}
