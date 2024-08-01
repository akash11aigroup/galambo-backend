import { Request } from "express";
import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  auth_provider: "jwt" | "google";
  comparePassword(_passcode: string): Promise<boolean>;
}

export interface IUserRequest extends Request {
  user?: any;
}

const UserSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
  },
  auth_provider: {
    type: String,
    enum: ["jwt", "google"],
    default: "jwt",
  },
});

export default UserSchema;
