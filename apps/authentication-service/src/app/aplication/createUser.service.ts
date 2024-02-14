import { User } from '@ecommerce/models';
import { AuthenticationIRepository } from '../domain/authentication.i.repository';

export class CreateUser {
  constructor(private authenticationRepository: AuthenticationIRepository) {}
  async run(user: User): Promise<Omit<User, 'password'>> {
    return await this.authenticationRepository.createUser(user);
  }
}
