import { Test } from '@nestjs/testing';
import { AuthenticationRepository } from '../../../apps/authentication-service/src/app/infraestructure/repositories/authentication.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../libs/models/src/lib/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { jwtConstants } from '../../../apps/authentication-service/src/app/infraestructure/controllers/auth.constants';
import { HttpException } from '@nestjs/common';

jest.mock('bcryptjs');

const mockUserRepository = () => ({
  save: jest.fn(),
  findOneBy: jest.fn(),
});

const mockJwtService = () => ({
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
});

const mockClientKafka = () => ({
  emit: jest.fn(),
});

describe('AuthenticationRepository', () => {
  let authenticationRepository: AuthenticationRepository;
  let userRepositoryMock: jest.Mocked<Repository<User>>;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationRepository,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: `KAFKA_CLIENT`, useFactory: mockClientKafka },
      ],
    }).compile();

    authenticationRepository = module.get<AuthenticationRepository>(AuthenticationRepository);
    userRepositoryMock = module.get<jest.Mocked<Repository<User>>>(getRepositoryToken(User));
    jwtServiceMock = module.get<jest.Mocked<JwtService>>(JwtService);
  });

  describe('createUser', () => {
    it('should hash password and save a new user', async () => {
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: 'plainPassword',
        orders: [],
      };
      const passwordHashed = 'hashedPassword';
      userRepositoryMock.save.mockResolvedValue(user);
      (bcrypt.hash as jest.Mock).mockResolvedValue(passwordHashed);

      const result = await authenticationRepository.createUser(user);

      const { password, ...savedUser } = user;

      expect(result).toEqual(savedUser);
      expect(userRepositoryMock.save).toHaveBeenCalledWith({
        ...user,
        password: passwordHashed,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
    });
  });

  describe('authenticate', () => {
    it('should authenticate a user and return a JWT token', async () => {
      const login = { email: 'johndoe@mail.com', password: 'plainPassword' };
      const user = { id: 1, name: 'John Doe', email: 'johndoe@mail.com', password: 'hashedPassword', orders: [] };

      userRepositoryMock.findOneBy.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtServiceMock.signAsync.mockResolvedValue('jwtToken');

      const result = await authenticationRepository.authenticate(login);

      expect(result).toEqual({ token: 'jwtToken' });
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({ email: 'johndoe@mail.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
    });

    it('should throw HttpException if authentication fails', async () => {
      const login = { email: 'johndoe@mail.com', password: 'wrongPassword' };
      const user = { id: 1, name: 'John Doe', email: 'johndoe@mail.com.com', password: 'hashedPassword', orders: [] };

      userRepositoryMock.findOneBy.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authenticationRepository.authenticate(login)).rejects.toThrow(HttpException);
    });
  });

  describe('verifyToken', () => {
    it('should verify a JWT token and return the associated user', async () => {
      const token = 'jwtToken';
      const payload = { email: 'johndoe@mail.com', id: 1 };

      jwtServiceMock.verifyAsync.mockResolvedValue(payload);

      const result = await authenticationRepository.verifyToken(token);

      expect(result).toEqual(payload);
      expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith(token, { secret: jwtConstants.secret });
    });
  });
});
