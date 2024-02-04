import mongoose, { Document, Schema } from "mongoose";

export interface RefreshTokenDocument extends Document {
  token: string;
  userId: mongoose.Types.ObjectId;
  expires: Date;
}

const refreshTokenSchema: Schema<RefreshTokenDocument> = new Schema({
  token: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  expires: Date,
});

const RefreshToken = mongoose.model<RefreshTokenDocument>(
  "RefreshToken",
  refreshTokenSchema
);

export default RefreshToken;
