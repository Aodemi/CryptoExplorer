import mongoose, { Schema, Document } from "mongoose";

export interface IMarketSnapshot extends Document {
  asset: string; // CoinGecko ID
  vsCurrency: string;
  currentPrice: number;
  marketCap: number;
  totalVolume: number;
  priceChangePercentage24h?: number;
  capturedAt: Date;
}

const MarketSnapshotSchema = new Schema<IMarketSnapshot>({
  asset: { type: String, required: true, index: true },
  vsCurrency: { type: String, required: true, index: true },
  currentPrice: { type: Number, required: true },
  marketCap: { type: Number, required: true },
  totalVolume: { type: Number, required: true },
  priceChangePercentage24h: { type: Number },
  capturedAt: { type: Date, required: true, default: Date.now, index: true }
}, { timestamps: true });

export const MarketSnapshotModel = mongoose.model<IMarketSnapshot>("MarketSnapshot", MarketSnapshotSchema);
