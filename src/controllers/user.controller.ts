import type { Response } from "express";
import { UserModel } from "../models/User";
import type { AuthRequest } from "../middlewares/auth";

export async function listFavorites(req: AuthRequest, res: Response) {
  if (!req.userId) return res.status(401).json({ message: "non autorisé" });
  const user = await UserModel.findById(req.userId);
  if (!user) return res.status(404).json({ message: "non trouvé" });
  res.json({ favorites: user.favorites });
}

export async function addFavorite(req: AuthRequest, res: Response) {
  if (!req.userId) return res.status(401).json({ message: "non autorisé" });
  const { coinId } = (req.body || {}) as { coinId?: string };
  if (!coinId) return res.status(400).json({ message: "coinId requis" });

  const user = await UserModel.findById(req.userId);
  if (!user) return res.status(404).json({ message: "non trouvé" });
  user.favorites = user.favorites ?? [];
  if (!user.favorites.includes(coinId)) user.favorites.push(coinId);
  await user.save();
  res.json({ favorites: user.favorites });
}

export async function removeFavorite(req: AuthRequest, res: Response) {
  if (!req.userId) return res.status(401).json({ message: "non autorisé" });
  const { coinId } = (req.params || {}) as { coinId?: string };
  const user = await UserModel.findById(req.userId);
  if (!user) return res.status(404).json({ message: "non trouvé" });
  user.favorites = (user.favorites ?? []).filter((c) => c !== coinId);
  await user.save();
  res.json({ favorites: user.favorites });
}
