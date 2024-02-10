import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';

import {
  ClientKafka,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { GetProductCatalog } from '../../aplication/getProductCatalog.service';

@Controller('')
export class ProductCatalogController implements OnModuleInit {
  constructor(
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka,
    @Inject(GetProductCatalog)
    private getProductCatalog: GetProductCatalog
  ) {}

  @MessagePattern('product-events')
  async handleGetProductCatalog(@Payload() message) {
    Logger.log({ message });
    return await this.getProductCatalog.run();
  }

  @EventPattern('user-events')
  handleUserLoggedInEvent(@Payload() message) {
    Logger.log({ message });
  }

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(`user-events`);
    this.kafkaClient.subscribeToResponseOf(`product-events`);
  }
}
