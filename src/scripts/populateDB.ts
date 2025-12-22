import axios from "axios";
import mongoose from "mongoose";
import { CryptoModel } from "../models/Crypto";
import { MarketSnapshotModel } from "../models/MarketSnapshot";
import { getMarkets } from "../services/coingecko.service";

const BASE = "https://api.coingecko.com/api/v3";
const KEY = process.env.COINGECKO_API_KEY || "CG-bUN7zukVERtxfaVLtmKGhDUY";
const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/crypto_explorer";

const DAYS = 90; // ~3 months
const MINUTE = 60_000;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function marketChart(id: string, d: number) {
  let attempt = 0;
  while (true) {
    try {
      const { data } = await axios.get(`${BASE}/coins/${id}/market_chart`, { params: { vs_currency: "usd", days: d }, headers: { "x-cg-api-key": KEY }, timeout: 20000 });
      return data as any;
    } catch (e: any) {
      const s = e?.response?.status;
      if (s === 429) { console.log(`429 ${id} — wait 60s`); await sleep(MINUTE); }
      else if (s === 401) { throw new Error(`401 Unauthorized for ${id}`); }
      else { const wait = 1200 * (++attempt) + Math.floor(Math.random() * 400); await sleep(wait); }
    }
  }
}

async function ensureCrypto(m: any) {
  const found = await CryptoModel.findOne({ coingeckoId: m.id });
  if (found) return found;
  return CryptoModel.create({ coingeckoId: m.id, symbol: m.symbol, name: m.name, image: m.image });
}

async function run() {
  await mongoose.connect(MONGO);
  await MarketSnapshotModel.deleteMany({});
  console.log("cleared snapshots");
  let markets: any[] = [];
  while (!markets.length) {
    try {
      markets = await getMarkets({ vs_currency: "usd", order: "market_cap_desc", per_page: 50, page: 1, price_change_percentage: "24h" });
    } catch (e: any) {
      const s = e?.status || e?.response?.status;
      if (s === 429) { console.log("429 markets — wait 60s"); await sleep(MINUTE); }
      else { await sleep(1500); }
    }
  }
  for (const m of markets) await ensureCrypto(m);
  const list = markets;
  let total = 0;
  for (const m of list) {
    const crypto = await ensureCrypto(m);
    const asset = crypto._id.toString();
    const chart = await marketChart(m.id, DAYS);
    const prices = Array.isArray(chart?.prices) ? chart.prices : [];
    const caps = new Map((chart?.market_caps || []).map((x: any) => [Number(x[0]), Number(x[1])])) as Map<number, number>;
    const vols = new Map((chart?.total_volumes || []).map((x: any) => [Number(x[0]), Number(x[1])])) as Map<number, number>;
    const mapPrice = new Map(prices.map((x: any) => [Number(x[0]), Number(x[1])])) as Map<number, number>;
    const docs = [] as any[];
    for (const [ts, price] of Array.from(mapPrice.entries()).sort((a, b) => a[0] - b[0])) {
      const prev = mapPrice.get(ts - 24 * 60 * 60 * 1000);
      const pct = prev && prev > 0 ? ((price - prev) / prev) * 100 : undefined;
      docs.push({ asset, vsCurrency: "usd", currentPrice: price, marketCap: caps.get(ts) || 0, totalVolume: vols.get(ts) || 0, priceChangePercentage24h: pct, capturedAt: new Date(ts) });
    }
    if (!docs.length) { console.log(`no new for ${m.id}`); continue; }
    const CHUNK = 1000;
    for (let i = 0; i < docs.length; i += CHUNK) {
      const batch = docs.slice(i, i + CHUNK);
      try { const res = await MarketSnapshotModel.insertMany(batch, { ordered: false }); total += res.length; } catch (e: any) { console.log(`insert error ${m.id}: ${e?.message || e}`); }
      await sleep(1500);
    }
    console.log(`inserted ${docs.length} for ${m.id}`);
    await sleep(8000);
  }
  console.log(`done total ${total}`);
  await mongoose.disconnect();
}

run().catch(async e => { console.error(e); try { await mongoose.disconnect(); } catch {} process.exit(1); });