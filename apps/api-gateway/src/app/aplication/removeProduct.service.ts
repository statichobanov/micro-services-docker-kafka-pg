import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class RemoveProduct {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(id: string): Promise<{ result: string }> {
    return await this.apiGatewayRepository.removeProduct(id);
  }
}
