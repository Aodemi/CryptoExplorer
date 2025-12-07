// src/services/crypto.service.ts
import axios from "axios";
import { getMarkets } from "./coingecko.service";

const BASE_URL = "https://api.coingecko.com/api/v3";


interface ListCryptosParams {
  page?: number;
  per_page?: number;
  sort?: "popular" | "recent";
  vs_currency?: string;
}

interface HistoryPoint {
  timestamp: number;
  price: number;
}


// Fonction pour lister les crypto 
export async function getCryptosFromAPI({
  page = 1,
  per_page = 20,
  sort = "popular",
  vs_currency = "usd",
}: ListCryptosParams) {
  if (sort === "recent") {
    return getMarkets({
      vs_currency,
      order: "id_desc",
      per_page,
      page,
      price_change_percentage: "24h"
    });
  }

  // Pour les plus populaires : tri par market cap
  return getMarkets({
    vs_currency,
    order: "market_cap_desc",
    per_page,
    page,
    price_change_percentage: "24h"
  });
}

// Fonction pour rechercher type de crypto (filtrage)
export async function rechercheCrypto({
    name, 
    vs_currency = 'usd',
    marketCapMin,
    marketCapMax,
    volumeMin,
    volumeMax,
    change24hMin,
    change24hMax,
    page = 1,
    per_page = 50,
}: any) {
  const data = await getMarkets({
    vs_currency,
    order: "market_cap_desc",
    per_page,
    page,
    price_change_percentage: "24h"
  });

  let filtered = data;

  if (name) {
    const search = name.toLowerCase();
    filtered = filtered.filter(
      c =>
        c.name.toLowerCase().includes(search) ||
        c.symbol.toLowerCase().includes(search)
    );
  }

  if (marketCapMin)
    filtered = filtered.filter(c => c.market_cap >= Number(marketCapMin));

  if (marketCapMax)
    filtered = filtered.filter(c => c.market_cap >= Number(marketCapMax));

  if (volumeMin)
    filtered = filtered.filter(c => c.total_volume >= Number(volumeMin));

  if (volumeMax)
    filtered = filtered.filter(c => c.total_volume >= Number(volumeMax));

  if (change24hMin)
    filtered = filtered.filter(c => c.price_change_percentage_24h >= Number(change24hMin));

  if (change24hMax)
    filtered = filtered.filter(c => c.price_change_percentage_24h >= Number(change24hMax));

  return filtered;
}

export async function getHistory(coinId: string, days: number = 30, vs_currency = "usd") {
  const url = `${BASE_URL}/coins/${coinId}/market_chart`;
  const res = await axios.get(url, {
    params: { vs_currency, days },
  });

  return res.data.prices; // format: [ [timestamp, price], ... ]
}

// Simple moving average
export function computeSMA(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = period; i <= data.length; i++) {
    const slice = data.slice(i - period, i);
    const avg = slice.reduce((a, b) => a + b, 0) / period;
    result.push(avg);
  }
  return result;
}

// Volatilité (écart-type)
export function computeVolatility(data: number[]): number {
  const mean = data.reduce((a, b) => a + b) / data.length;
  const variance = data.map((p) => (p - mean) ** 2).reduce((a, b) => a + b) / data.length;
  return Math.sqrt(variance);
}
