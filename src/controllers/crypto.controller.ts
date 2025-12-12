import { Request, Response } from "express";
import { CryptoModel } from "../models/Crypto";

// Controller pour liste des cryptos
// Récupère les cryptos dans la BD
// Envoie la réponse
export async function listCryptos(_req: Request, res: Response) {
  const cryptos = await CryptoModel.find().sort({ name: 1 }).lean();
  res.json({ count: cryptos.length, data: cryptos });
}
