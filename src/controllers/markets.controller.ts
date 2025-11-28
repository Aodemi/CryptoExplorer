import { Request, Response } from "express";
import { getMarkets } from "../services/coingecko.service";
import { CryptoModel } from "../models/Crypto";
import { MarketSnapshotModel } from "../models/MarketSnapshot";

export async function listMarkets(req: Request, res: Response) {
  const vs_currency = (req.query.vs_currency as string) || "usd";
  const ids = (req.query.ids as string) || undefined;
  const per_page = req.query.per_page ? Number(req.query.per_page) : 50;
  const page = req.query.page ? Number(req.query.page) : 1;

  const data = await getMarkets({ vs_currency, ids, per_page, page, order: "market_cap_desc", price_change_percentage: "24h" });
  res.json({ count: data.length, data });
}

export async function convertToNewModel(req: Request, res: Response) {
  const vs_currency = (req.body?.vs_currency as string) || "usd";
  const ids = (req.body?.ids as string) || undefined;
  const per_page = req.body?.per_page ? Number(req.body.per_page) : 50;
  const page = req.body?.page ? Number(req.body.page) : 1;

  const data = await getMarkets({ vs_currency, ids, per_page, page, order: "market_cap_desc", price_change_percentage: "24h" });

  let inserted = 0;
  for (const d of data) {
    const { id: coingeckoId, symbol, name, image, current_price, market_cap, total_volume, price_change_percentage_24h } = d;
    const crypto = await CryptoModel.findOneAndUpdate(
      { coingeckoId },
      { coingeckoId, symbol, name, image },
      { new: true, upsert: true }
    );
    await MarketSnapshotModel.create({
      asset: crypto._id,
      vsCurrency: vs_currency,
      currentPrice: current_price,
      marketCap: market_cap,
      totalVolume: total_volume,
      priceChangePercentage24h: price_change_percentage_24h,
      capturedAt: new Date()
    });
    inserted += 1;
  }

  res.status(201).json({ message: "Conversion effectuée (snapshots enregistrés)", inserted });
}
