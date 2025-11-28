import mongoose, { Schema, Document } from "mongoose";

export interface ICrypto extends Document {
  coingeckoId: string;
  symbol: string;
  name: string;
  image?: string;
}

const CryptoSchema = new Schema<ICrypto>({
  coingeckoId: { type: String, required: true, unique: true, index: true },
  symbol: { type: String, required: true, index: true },
  name: { type: String, required: true, index: true },
  image: { type: String }
}, { timestamps: true });

export const CryptoModel = mongoose.model<ICrypto>("Crypto", CryptoSchema);
