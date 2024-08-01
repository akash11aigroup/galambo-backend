import { SignJWT, jwtVerify } from "jose";
import { IUser } from "../models/schemas/userSchema";
import { Request } from "express";
import { v4 as uuidV4 } from "uuid";

interface UserJwtPayload {
  email?: string;
  id?: string;
  isAdmin?: boolean;
  isActive?: boolean;
  jti: string;
  iat: number;
  exp: number;
}

export class AuthError extends Error {}

// ------------------ Generate new jwt token and return with NextResponse and verify by cookie ------------------
export async function verifyAuth(req: Request) {
  const token = req.cookies.get("user-token")?.value;

  if (!token) throw new AuthError("Missing user token");

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    );
    return verified.payload as UserJwtPayload;
  } catch (err) {
    throw new AuthError("Your token has expired.");
  }
}
// ------------------------------------------------------------------------------------------------------------

// ------------------ generate new JWT Token and verify token by request header -----------------------
export const generateJwtToken = async (user: IUser) => {
  const token = await new SignJWT({
    auth: user.email,
    id: user._id,
  })
    .setProtectedHeader({ alg: "HS256" })
    // .setJti(nanoid())
    .setJti(uuidV4())
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN ?? 0)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));
  return token;
};

export const verifyAuthByHeader = async (token: string) => {
  if (!token) throw new AuthError("Missing user token");

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    );
    return verified.payload as UserJwtPayload;
  } catch (err) {
    throw new AuthError("Your token has expired.");
  }
};
// -----------------------------------------------------------------------------------------------------

// ------------------ Email Verification with JWT ------------------------------------------------------
interface EmailJWTPayload {
  email?: string;
  id?: string;
  jti: string;
  iat: number;
  exp: number;
  method?: "register" | "password";
}

export const generateEmailVerificationJwtToken = async (
  user: IUser,
  method: string
) => {
  try {
    const token = await new SignJWT({
      auth: user.email,
      id: user._id,
      method: method,
    })
      .setProtectedHeader({ alg: "HS256" })
      // .setJti(nanoid())
      .setJti(uuidV4())
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EMAIL_EXPIRES_IN ?? 0)
      .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));

    return token;
  } catch (err) {
    throw new Error("Failed to generate new Token");
  }
};

export const verifyEmailToken = async (token: string) => {
  if (!token) throw new AuthError("Missing email token");

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    );
    return verified.payload as EmailJWTPayload;
  } catch (err) {
    throw new AuthError("Your token has expired.");
  }
};
// -----------------------------------------------------------------------------------------------------
