import { Inject, UnauthorizedException } from '@nestjs/common';
import { AuthenticationIRepository } from '../../domain/authentication.i.repository';
import { ClientKafka } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Login, User } from '@ecommerce/models';
import * as bcrypt from 'bcryptjs';

export class AuthenticationRepository implements AuthenticationIRepository {
  constructor(
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async createUser(user: User) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userHashed = {
      ...user,
      password: hashedPassword,
    };
    const result = await this.userRepository.save(userHashed);
    delete result.password;
    return result;
  }

  async authenticate(login: Login) {
    const user = await this.userRepository.findOneBy({ email: login.email });
    if (user && (await bcrypt.compare(login.password, user.password))) {
      const { password, ...payload } = user;
      const message = JSON.stringify({
        type: 'user-login',
        data: user,
      });
      this.kafkaClient.emit('user-events', message);
      return {
        token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException();
    }
  }
}
