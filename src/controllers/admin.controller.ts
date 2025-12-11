import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User";
import { signToken } from "../utils/jwt";

export async function createAdminUser(req: Request, res: Response) {
    try{
        const {email = "admin@gmail.com", username = "admin", password = "admin123"} = req.body || {};
        const passwordHash = await bcrypt.hash(password, 10);
        const admin = await UserModel.findOneAndUpdate(
            { email },
            { username, passwordHash, role: "admin" },
            { upsert: true, new: true }
        );
        res.status(201).json({ message: "Admin user crée", user: { id: admin._id, email: admin.email, username: admin.username, role: admin.role } });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message }); 
    }
    
}




export async function usersList(req: Request, res: Response) {
  try {
    const users = await UserModel.find({}, { passwordHash: 0 }).lean();
    res.json(users);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await UserModel.findByIdAndDelete(id);
    res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (e: any) {  
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

export async function modifyUserRole(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { role } = req.body || {};
    if (!role) return res.status(400).json({ error: "Rôle requis" });
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    user.role = role;
    await user.save();
    res.json({ message: "Rôle modifié avec succès", user: { id: user._id, email: user.email, username: user.username, role: user.role } });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  } 
}

