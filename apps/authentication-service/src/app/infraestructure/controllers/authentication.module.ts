import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { Authenticate } from '../../aplication/authenticate.service';
import { AuthenticationRepository } from '../repositories/authentication.repository';
import { AuthenticationIRepository } from '../../domain/authentication.i.repository';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { User } from '@ecommerce/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUser } from '../../aplication/createUser.service';
import { VerifyToken } from '../../aplication/verifyToken.service';
import { SaveOrder } from '../../aplication/saveOrder.service';

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
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([User]),
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
    {
      provide: CreateUser,
      useFactory(authenticationRepository: AuthenticationIRepository) {
        return new CreateUser(authenticationRepository);
      },
      inject: [AuthenticationRepository],
    },
    {
      provide: VerifyToken,
      useFactory(authenticationRepository: AuthenticationIRepository) {
        return new VerifyToken(authenticationRepository);
      },
      inject: [AuthenticationRepository],
    },
    {
      provide: SaveOrder,
      useFactory(authenticationRepository: AuthenticationIRepository) {
        return new SaveOrder(authenticationRepository);
      },
      inject: [AuthenticationRepository],
    },
  ],
})
export class AuthenticationModule {}
