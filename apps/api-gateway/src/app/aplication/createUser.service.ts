import { UserModel } from '@ecommerce/models';
import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class CreateUser {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(user: UserModel) {
    return this.apiGatewayRepository.createUser(user);
  }
}
