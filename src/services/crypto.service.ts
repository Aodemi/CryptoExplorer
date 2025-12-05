// src/services/crypto.service.ts
import { getMarkets } from "./coingecko.service";

interface ListCryptosParams {
  page?: number;
  per_page?: number;
  sort?: "popular" | "recent";
  vs_currency?: string;
}

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
