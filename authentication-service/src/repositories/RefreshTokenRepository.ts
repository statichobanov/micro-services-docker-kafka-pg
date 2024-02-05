import RefreshTokenEntity from "../entities/RefreshToken";

export interface RefreshTokenAttributes {
  token: string;
  userId: string;
  expires?: Date;
}

class RefreshTokenRepository {
  async saveRefreshToken({
    token,
    userId,
  }: RefreshTokenAttributes): Promise<void> {
    console.log("RefreshTokenRepository saveRefreshToken: ", token, userId);
    const newRefreshToken = new RefreshTokenEntity({
      token: token,
      userId: userId,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) /* One day */,
    });

    newRefreshToken.save();
  }

  async deleteAllRefreshTokens({ userId }: { userId: string }): Promise<void> {
    const result = await RefreshTokenEntity.deleteMany({ userId: userId });

    /* just for info */
    if (result.deletedCount > 0) {
      console.log(
        `Deleted ${result.deletedCount} tokens for userId: ${userId}`
      );
    } else {
      console.log(`No existing tokens found for userId: ${userId}`);
    }
  }

  async findRefreshToken(userId: string): Promise<any> {
    return await RefreshTokenEntity.find({ userId: userId });
  }
}

export default RefreshTokenRepository;
