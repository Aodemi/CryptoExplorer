import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User";
import { signToken } from "../utils/jwt";

export async function register(req: Request, res: Response) {
  const { email, username, password } = req.body || {};
  if (!email || !username || !password) return res.status(400).json({ error: "email, nom d'utilisateur et mot de passe requis" });
  const existing = await UserModel.findOne({ email });
  if (existing) return res.status(409).json({ error: "Email déjà enregistré" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ email, username, passwordHash });
  const token = signToken({ userId: user._id.toString(), role: user.role });
  res.status(201).json({ token, user: { id: user._id, email: user.email, username: user.username, role: user.role } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email et mot de passe requis" });
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(401).json({ error: "Identifiants invalides" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Identifiants invalides" });
  const token = signToken({ userId: user._id.toString(), role: user.role });
  res.json({ token, user: { id: user._id, email: user.email, username: user.username, role: user.role, favorites: user.favorites || [] } });
}
