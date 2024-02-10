import { AuthenticationIRepository } from '../domain/authentication.i.repository';

export class Authenticate {
  constructor(private authenticationRepository: AuthenticationIRepository) {}
  async run(user) {
    return this.authenticationRepository.authenticate(user);
  }
}
