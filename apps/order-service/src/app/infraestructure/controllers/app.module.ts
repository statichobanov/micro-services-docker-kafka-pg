import { Module } from '@nestjs/common';

import { OrderModule } from './order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Product, User } from '@ecommerce/models';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'mariadb',
      port: 3306,
      username: 'user',
      password: 'test123',
      database: 'ecommerce',
      entities: [Order, Product, User],
      synchronize: true,
    }),
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
