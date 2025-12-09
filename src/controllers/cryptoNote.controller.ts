import { Request, Response } from "express";
import {computeSuccessScore} from "../services/cryptoNote.service";
import { error } from "console";

export async function getSuccessScore(req: Request, res: Response) {
    try {
        const result = await computeSuccessScore();
        res.json(result);
    } catch (e:any) {
        res.status(500).json({error: e.message})
    }
    
}