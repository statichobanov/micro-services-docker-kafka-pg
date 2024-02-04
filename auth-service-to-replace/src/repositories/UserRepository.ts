import UserEntity from "../entities/User";

class UserRepository {
  async createUser(userData: any): Promise<any> {
    const newUser = new UserEntity(userData);
    await newUser.save();
    return newUser;
  }

  async findUserById(userId: string): Promise<any | null> {
    return UserEntity.findById(userId);
  }

  async findUserByUsername(username: string): Promise<any | null> {
    return UserEntity.findOne({ username });
  }

  async findUserByEmail(email: string): Promise<any | null> {
    return UserEntity.findOne({ email });
  }

  async findAllUsers(): Promise<any[]> {
    return UserEntity.find({}, "-password");
  }
}

export default UserRepository;
