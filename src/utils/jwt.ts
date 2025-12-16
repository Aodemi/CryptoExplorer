import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config";

export function signToken(payload: Record<string, unknown>, expiresIn: string | number = "1d") {
  const options: SignOptions = {};
  (options as any).expiresIn = expiresIn;
  return jwt.sign(payload as any, config.jwtSecret as unknown as jwt.Secret, options);
}

export function verifyToken<T = unknown>(token: string): T {
  return jwt.verify(token, config.jwtSecret as unknown as jwt.Secret) as T;
}
