import { CryptoModel } from "../models/Crypto";
import { MarketSnapshotModel } from "../models/MarketSnapshot";
import axios from "axios";


// Paramètre utilisés pour les services
interface ListCryptosParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Fonction qui va rechercher les cryptos (avec filtre)
// Recherche avec regex pour que ça soit plus préçis 
// Filtre avec nom (sinon renvoie tout)
// Compte nombre d'éléments trouvés selon le filtre
// Récupère les cryptos avec filtre et renvoie le résultat
export async function getCryptos({
  page = 1,
  limit = 20,
  search
}: ListCryptosParams) {
    
  const searchTerm = (search || '').trim();

  let regex = `^${searchTerm}$`;
  
  const filter = searchTerm.length > 0 
    ? { name: { $regex: regex, $options: "i" } } 
    : {}; 

  const finalLimit = searchTerm.length > 0 ? 1 : limit;

  const total = await CryptoModel.countDocuments(filter);

  const cryptos = await CryptoModel.find(filter)
    .skip((page - 1) * limit) 
    .limit(finalLimit)
    .lean();

  return {
    page,
    limit: finalLimit,
    total,
    totalPages: Math.ceil(total / limit), 
    data: cryptos
  };
}


// Fonction pour récupérer l'historique
// Recherche la crypto dans la BD
// Calcule la date
// Recherche des snapshots dans l'historique
// Renvoie résultat
export async function getHistoryFromDB(coinId: string, days = 30) {
  const crypto = await CryptoModel.findOne({ coingeckoId: coinId });
  if (!crypto) throw new Error("Crypto introuvable dans la BD");

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const snapshots = await MarketSnapshotModel.find({
    asset: crypto._id,
    capturedAt: { $gte: since }
  })
    .sort({ capturedAt: 1 })
    .lean();

  // retourne uniquement les prix (comme CoinGecko)
  return snapshots.map(s => s.currentPrice);
}

// Fonction calcul SMA (Moyenne Mobile Simple)
// Calcul SMA de chaque crypto
// Extrait des derniers points
// Calcule la moyenne 
// Ajoute SMA dans le résultat et retourne résultat
export function computeSMA(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = period; i <= data.length; i++) {
    const slice = data.slice(i - period, i);
    const avg = slice.reduce((a, b) => a + b, 0) / period;
    result.push(avg);
  }
  return result;
}

// Fonction calcule Volatility 
// Calcule moyenne des prix
// Calcule la variance & Retourne racine carré de la variance
export function computeVolatility(data: number[]): number {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance =
    data.map(p => (p - mean) ** 2).reduce((a, b) => a + b, 0) / data.length;
  return Math.sqrt(variance);
}

// Fonction qui note une crypto selon les critères suivants => SMA, Volatility, Variance, prix
// Vérifie l'historique
// Récupère prix initial et final
// Calcul variation et ajout / retrait point
// Calcul moyenne prix 
// Calcul volatilité et ajout / retrait point 
// Normalisation score sur 100
// Message selon nombre de points
export function calculerNoteCrypto(coinId: string, history: number[]) {
  if (!history || history.length === 0) {
    throw new Error("Historique introuvable");
  }

  let score = 20;

  const lastPrice = history[history.length - 1];
  const firstPrice = history[0];

  const variation = ((lastPrice - firstPrice) / firstPrice) * 100;

  if (variation > 0) score += 10;
  if (variation > 20) score += 15;
  if (variation < -10) score -= 10;

  const mean = history.reduce((a, b) => a + b, 0) / history.length;
  const volatility = Math.sqrt(
    history.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / history.length
  );

  if (volatility < mean * 0.05) score += 10;
  else if (volatility > mean * 0.02) score -= 10;

  score = Math.max(0, Math.min(100, Math.round(score)));

  const message =
    score > 70
      ? "Probabilité élevée de succès pour cette crypto"
      : score >= 50
      ? "Probabilité modérée de succès"
      : "Faible probabilité de succès";

  return {
    coinId,
    score,
    daysAnalyzed: history.length,
    variation: parseFloat(variation.toFixed(2)),
    volatility: parseFloat(volatility.toFixed(2)),
    message
  };
}
