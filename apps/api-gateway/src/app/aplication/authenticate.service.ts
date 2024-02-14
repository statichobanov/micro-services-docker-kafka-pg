import { LoginModel } from '@ecommerce/models';
import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class Authenticate {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(login: LoginModel): Promise<{ token: string }> {
    return await this.apiGatewayRepository.authenticate(login);
  }
}
