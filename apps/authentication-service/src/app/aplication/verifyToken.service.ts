import { User } from '@ecommerce/models';
import { AuthenticationIRepository } from '../domain/authentication.i.repository';

export class VerifyToken {
  constructor(private authenticationRepository: AuthenticationIRepository) {}
  async run(token: string): Promise<Omit<User, 'password'>> {
    return await this.authenticationRepository.verifyToken(token);
  }
}
