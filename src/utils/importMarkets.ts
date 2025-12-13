// ./utils/importMarkets.ts
import { getMarkets } from "../services/coingecko.service";
import { CryptoModel } from "../models/Crypto";
import { MarketSnapshotModel } from "../models/MarketSnapshot";

export async function importMarketsToDB(vs_currency = "usd") {
  const data = await getMarkets({
    vs_currency,
    order: "market_cap_desc",
    per_page: 50,
    page: 1,
    price_change_percentage: "24h"
  });

  for (const d of data) {
    const crypto = await CryptoModel.findOneAndUpdate(
      { coingeckoId: d.id },
      { coingeckoId: d.id, symbol: d.symbol, name: d.name, image: d.image },
      { new: true, upsert: true }
    );

    await MarketSnapshotModel.create({
      asset: crypto._id,
      vsCurrency: vs_currency,
      currentPrice: d.current_price,
      marketCap: d.market_cap,
      totalVolume: d.total_volume,
      priceChangePercentage24h: d.price_change_percentage_24h,
      capturedAt: new Date()
    });
  }

  console.log("✓ Import des cryptos et snapshots terminé");
}
