// src/controllers/cryptoAnalyse.controller.ts
import { Request, Response } from "express";
import { getHistory, computeSMA, computeVolatility, calculerNoteCrypto } from "../services/crypto.service";

export async function analyseCrypto(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { period = 7 } = req.query; 

    // Récupération de l'historique des prix
    const raw = await getHistory(id);
    if (!raw || raw.length === 0) {
      return res.status(404).json({ error: "Historique introuvable" });
    }

    const prices = raw.map((p: number[]) => p[1]);

    // Calcul des indicateurs
    const sma = computeSMA(prices, Number(period));
    const volatility = computeVolatility(prices);

    // Variation du dernier prix par rapport au premier
    const variation = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;

    // Création d'un objet coin minimal pour le score
    const coinForScore = {
      price_change_percentage_24h: variation,
      market_cap: 0, // si tu as la market cap tu peux la mettre ici
      total_volume: 0 // idem pour volume
    };

    // Calcul du score de succès
    const successData = calculerNoteCrypto(coinForScore, prices);

    res.json({
      id,
      period: Number(period),
      prices,
      sma,
      volatility,
      variation,
      successScore: successData.score,
      message: successData.message
    });

  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
