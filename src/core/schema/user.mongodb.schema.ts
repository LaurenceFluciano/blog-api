import { Schema, Types } from "mongoose";
import { UserEntity } from "../entity/user.entity.js";

export interface UserDocument extends Document, UserEntity{
    _id: Types.ObjectId;
}

export const UserSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});