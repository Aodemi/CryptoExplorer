import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";

let lastCallAt = 0;
const MIN_INTERVAL_MS = 1200;

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function waitForSlot() {
  const now = Date.now();
  const wait = lastCallAt + MIN_INTERVAL_MS - now;
  if (wait > 0) await sleep(wait);
  lastCallAt = Date.now();
}

export async function getMarkets(params: {
  vs_currency: string;
  ids?: string;
  order?: string;
  per_page?: number;
  page?: number;
  price_change_percentage?: string;
}) {
  await waitForSlot();
  try {
    const res = await axios.get(`${BASE_URL}/coins/markets`, { params, timeout: 15000 });
    return res.data as any[];
  } catch (e: any) {
    if (e?.response?.status === 429) {
      const err: any = new Error("Trop de requêtes vers CoinGecko");
      err.status = 429;
      throw err;
    }
    throw e;
  }
}
