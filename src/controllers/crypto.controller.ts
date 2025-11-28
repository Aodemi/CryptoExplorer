import { Request, Response } from "express";
import { CryptoModel } from "../models/Crypto";

export async function listCryptos(_req: Request, res: Response) {
  const cryptos = await CryptoModel.find().sort({ name: 1 }).lean();
  res.json({ count: cryptos.length, data: cryptos });
}
