import { Request, Response } from "express";
import { 
  getHistoryFromDB, 
  computeSMA, 
  computeVolatility, 
  calculerNoteCrypto 
} from "../services/crypto.service";

export async function analyseCrypto(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { period = 7 } = req.query;

    const raw = await getHistoryFromDB(id);
    if (!raw || raw.length === 0) {
      return res.status(404).json({ error: "Historique introuvable" });
    }

    const prices = raw;

    const sma = computeSMA(prices, Number(period));
    const volatility = computeVolatility(prices);

    const note = calculerNoteCrypto(id, prices);

    return res.json({
      id,
      period: Number(period),
      prices,
      sma,
      volatility,
      successScore: note.score,
      variation: note.variation,      
      message: note.message,
      daysAnalyzed: note.daysAnalyzed
    });

  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
