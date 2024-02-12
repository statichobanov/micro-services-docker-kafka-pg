import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication.module';
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
      entities: [User, Order, Product],
      synchronize: true,
    }),
    AuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
