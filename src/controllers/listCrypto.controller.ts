// src/controllers/crypto.controller.ts
import { Request, Response } from "express";
import { getCryptosFromAPI } from "../services/crypto.service";

export async function listCryptosAPI(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const per_page = Number(req.query.limit) || 20;
    const sort = (req.query.sort as "popular" | "recent") || "popular";
    const vs_currency = (req.query.vs_currency as string) || "usd";

    const data = await getCryptosFromAPI({ page, per_page, sort, vs_currency });

    res.json({
      page,
      per_page,
      count: data.length,
      data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération depuis CoinGecko" });
  }
}
