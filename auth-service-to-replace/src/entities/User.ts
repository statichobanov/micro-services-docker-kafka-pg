import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
  version: number;
  username: string;
  email: string;
  author?: boolean;
  registrationDate: Date;
  firstName?: string;
  lastName?: string;
  password: string;
  isValidPassword(password: string): Promise<boolean>;
}

const userSchema: Schema<UserDocument> = new Schema({
  version: { type: Number, default: 1 },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  author: { type: Boolean },
  registrationDate: { type: Date, default: Date.now },
  firstName: String,
  lastName: String,
  password: String,
});

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (
  password: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
