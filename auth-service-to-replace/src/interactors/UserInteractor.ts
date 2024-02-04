import UserRepository from "../repositories/UserRepository";

class UserInteractor {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(user: any): Promise<any> {
    const { username } = user;

    try {
      const existingUser = await this.userRepository.findUserByUsername(
        username
      );

      if (existingUser) {
        throw new Error("Username already taken");
      }

      const newUser = await this.userRepository.createUser(user);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const user = await this.userRepository.findUserByEmail(email);

      if (!user || !(await user.isValidPassword(password))) {
        throw new Error("Incorrect email or password");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findAllUsers(): Promise<any[]> {
    try {
      return await this.userRepository.findAllUsers();
    } catch (error) {
      throw error;
    }
  }
}

export default UserInteractor;
