import { AuthenticationIRepository } from '../domain/authentication.i.repository';

export class VerifyToken {
  constructor(private authenticationRepository: AuthenticationIRepository) {}
  async run(token: string) {
    return this.authenticationRepository.verifyToken(token);
  }
}
