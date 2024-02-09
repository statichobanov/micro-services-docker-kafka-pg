import UserEntity from "../entities/UserEntity";
import { UserPayload } from "../entities/UserPayload";
import UserRepository from "../repositories/UserRepository";

class UserInteractor {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(user: UserPayload): Promise<UserEntity> {
    const { username } = user;

    try {
      const existingUser = await this.userRepository.findUserByUsername(
        username
      );

      if (existingUser) {
        throw new Error("Username already taken");
      }

      const newUser: UserEntity = await this.userRepository.createUser(user);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<UserEntity[]> {
    try {
      const users = await this.userRepository.getAll();

      return users;
    } catch (error) {
      throw error;
    }
  }
}

export default UserInteractor;
