import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  passwordHash: string;
  role: "user" | "admin";
  favorites?: Types.ObjectId[]; // Les cryptomonnaies favorites de l'utilisateur
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  username: { type: String, required: true, minlength: 3, maxlength: 30, match: /^[A-Za-z0-9._-]+$/ },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user", index: true },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Crypto" }]
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>("User", UserSchema);
