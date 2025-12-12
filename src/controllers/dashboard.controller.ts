import {Request, Response} from "express";
import { getUserDashboard } from "../services/dashboard.service";

// Controller dashboard cryptos
// Récupère utilisateur connecté
// Appelle le service 
// Retourne le résultat
export async function dashboardController(req: Request, res: Response) {
    try {
        const userId = (req as any).user._id
        const result = await getUserDashboard(userId);
        return res.json(result)
    } catch (err: any) {
        return res.status(500).json({ error: err.message})
    }
}