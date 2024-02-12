import { User } from '@ecommerce/models';
import { AuthenticationIRepository } from '../domain/authentication.i.repository';

export class CreateUser {
  constructor(private authenticationRepository: AuthenticationIRepository) {}
  async run(user: User) {
    return this.authenticationRepository.createUser(user);
  }
}
