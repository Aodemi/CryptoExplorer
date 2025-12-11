// src/services/dashboard.service.ts
import { UserModel } from "../models/User";
import { CryptoModel } from "../models/Crypto";
import { MarketSnapshotModel } from "../models/MarketSnapshot";

export async function getUserDashboard(userId: string, vs_currency = "usd") {
  const user = await UserModel.findById(userId).lean();
  if (!user) throw new Error("Utilisateur introuvable");

  const favorites = user.favorites || [];
  if (favorites.length === 0) return { favorites: [], message: "Aucun crypto suivi." };

  const cryptos = await CryptoModel.find({ _id: { $in: favorites } }).lean();

  const dashboard = await Promise.all(
    cryptos.map(async (crypto) => {
      const snapshot = await MarketSnapshotModel.findOne({
        asset: crypto._id,
        vsCurrency: vs_currency
      }).sort({ capturedAt: -1 }).lean();

      return {
        id: crypto._id,
        name: crypto.name,
        symbol: crypto.symbol,
        price: snapshot?.currentPrice || null,
        marketCap: snapshot?.marketCap || null,
        volume: snapshot?.totalVolume || null,
        change24h: snapshot?.priceChangePercentage24h || null,
        image: crypto.image || null
      };
    })
  );

  return { favorites: dashboard };
}
