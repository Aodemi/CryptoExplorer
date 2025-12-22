import { Request, Response } from "express";
import mongoose from "mongoose";
import { analyseCrypto } from "../controllers/cryptoAnalyse.controller";
import { CryptoModel } from "../models/Crypto";
import { MarketSnapshotModel } from "../models/MarketSnapshot";

describe("Controller analyseCrypto", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    const db = mongoose.connection.db;
    if (db) {
      await db.collection("cryptos").deleteMany({});
      await db.collection("marketsnapshots").deleteMany({});
    }
  });

  it("doit retourner l'analyse crypto", async () => {
    const crypto = await CryptoModel.create({
      coingeckoId: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      image: "https://bitcoin.org/img/icons/opengraph.png"
    });

    await MarketSnapshotModel.create({
      asset: crypto._id,
      vsCurrency: "usd",
      currentPrice: 100,
      marketCap: 800000000,
      totalVolume: 5000000,
      priceChangePercentage24h: 2,
      capturedAt: new Date()
    });

    const req = { params: { id: "bitcoin" }, query: {} } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;

    await analyseCrypto(req, res);

    const response = (res.json as jest.Mock).mock.calls[0][0];

    expect(response.id).toBe("bitcoin");
  });
});
