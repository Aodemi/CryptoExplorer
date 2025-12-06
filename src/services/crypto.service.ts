// src/services/crypto.service.ts
import { getMarkets } from "./coingecko.service";

interface ListCryptosParams {
  page?: number;
  per_page?: number;
  sort?: "popular" | "recent";
  vs_currency?: string;
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