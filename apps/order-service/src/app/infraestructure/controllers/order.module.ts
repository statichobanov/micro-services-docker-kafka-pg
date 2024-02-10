import { Module } from '@nestjs/common';

import { OrderController } from './order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CreateOrder } from '../../aplication/createOrder.service';
import { OrderRepository } from '../repositories/order.repository';
import { OrderIRepository } from '../../domain/order.i.repository';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'order-service',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'order-service-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderRepository,
    {
      provide: CreateOrder,
      useFactory(orderRepository: OrderIRepository) {
        return new CreateOrder(orderRepository);
      },
      inject: [OrderRepository],
    },
  ],
})
export class OrderModule {}
