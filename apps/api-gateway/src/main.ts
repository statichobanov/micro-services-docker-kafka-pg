/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

import authenticateToken from './app/middleware/authenticateToken';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const authenticationServiceProxy = createProxyMiddleware({
    target: 'http://authentication-service:3001',
    changeOrigin: true,
  });

  const productCatalogServiceProxy = createProxyMiddleware({
    target: 'http://product-catalog-service:3002',
    changeOrigin: true,
  });

  const orderServiceProxy = createProxyMiddleware({
    target: 'http://order-service:3004',
    changeOrigin: true,
  });

  // Use the proxies based on the path
  app.use('/authentication', authenticateToken, authenticationServiceProxy);
  app.use('/product-catalog', productCatalogServiceProxy);
  app.use('/order/create', orderServiceProxy);

  const port = process.env.PORT || 3003;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
