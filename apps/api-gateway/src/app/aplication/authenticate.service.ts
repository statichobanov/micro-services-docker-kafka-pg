import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class Authenticate {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(user) {
    return this.apiGatewayRepository.authenticate(user);
  }
}
