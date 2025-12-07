// src/controllers/crypto.controller.ts
import { Request, Response } from "express";
import { getHistory,computeSMA,computeVolatility} from "../services/crypto.service";

export async function analyseCrypto(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { days = 30, period = 7 } = req.query;

    const raw = await getHistory(id, Number(days));

    const prices = raw.map((p: number[]) => p[1]);

    const sma = computeSMA(prices, Number(period));
    const volatility = computeVolatility(prices);

    res.json({
      id,
      days,
      period,
      volatility,
      sma,
      prices
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
