/** User Model based on user schema for mongoose */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import UserSchema, { IUser } from "./schemas/userSchema";
import signPayload from "../configs/signPayload";

// const expires = eval(JWT_EXPIRES_IN) ?? 1000 * 60 * 15;

UserSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();
  if (user.password) {
    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;

    next();
  }
});

UserSchema.methods.generateToken = async function () {
  return await signPayload({
    payload: {
      id: this._id,
      username: this.username,
      email: this.email,
    },
    secret: process.env.JWT_SECRET || "",
    expirationTime: process.env.JWT_EXPIRES_IN || "",
  });
};

UserSchema.methods.comparePassword = function (enteredPassword: string) {
  const user = this as IUser;
  return bcrypt.compareSync(enteredPassword, user.password ?? "");
};

export const hashPassword = async (password: string) => {
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });

  return hashedPassword;
};

const User = mongoose.model<IUser>("users", UserSchema);
export default User;
