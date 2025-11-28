import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export default function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || "Erreur interne du serveur";
  if (status >= 500) {
    logger.error(`Error ${status}: ${message}`);
  }
  res.status(status).json({ error: message });
}
