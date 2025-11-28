import jwt from "jsonwebtoken";
import { config } from "../config";

export function signToken(payload: object, expiresIn: string = "1d") {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, config.jwtSecret) as T;
}
