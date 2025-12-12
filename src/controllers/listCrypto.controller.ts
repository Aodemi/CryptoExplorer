import { Request, Response } from "express";
import { getCryptos } from "../services/crypto.service";

// Controller pour liste des cryptos
// Récupère les cryptos dans la BD
// Gère page (pagination + filtrage)
// Envoie la réponse
export async function listCryptosDB(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search as string | undefined;

    const data = await getCryptos({ page, limit, search });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des cryptos depuis la base" });
  }
}

// Controller rechercher les cryptos
// Récupère le crypto qu'on recherche
// Nettoie la valeur
// Appelle le service pour chercher la crypto
// Retourne résultat
export async function rechercherCrypto(req: Request, res: Response) {
  try {
    const search = req.params.name; 

    const searchTerm = (search || '').trim();

    if (searchTerm.length === 0) {
        return res.status(400).json({ message: "Le terme de recherche ne peut pas être vide." });
    }

    const result = await getCryptos({ 
        search: searchTerm, 
        page: 1, 
        limit: 1, 
    });
    
    if (result.data.length === 0) {
      return res.status(404).json({ message: "Crypto non trouvée" });
    }

    res.json(result.data[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la recherche de la crypto" });
  }
}
