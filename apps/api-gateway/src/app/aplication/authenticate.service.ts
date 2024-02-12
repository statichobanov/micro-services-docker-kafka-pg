import { LoginModel } from '@ecommerce/models';
import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class Authenticate {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(login: LoginModel) {
    return this.apiGatewayRepository.authenticate(login);
  }
}
