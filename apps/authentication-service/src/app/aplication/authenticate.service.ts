import { Login, User } from '@ecommerce/models';
import { AuthenticationIRepository } from '../domain/authentication.i.repository';

export class Authenticate {
  constructor(private authenticationRepository: AuthenticationIRepository) {}
  async run(login: Login): Promise<Omit<User, 'password'>> {
    return await this.authenticationRepository.authenticate(login);
  }
}
