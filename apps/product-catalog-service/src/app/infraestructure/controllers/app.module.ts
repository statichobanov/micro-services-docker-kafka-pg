import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCatalogModule } from './productCatalog.module';
import { Product } from '@ecommerce/models';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'mariadb',
      port: 3306,
      username: 'user',
      password: 'test123',
      database: 'ecommerce',
      entities: [Product],
      synchronize: true,
    }),
    ProductCatalogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
