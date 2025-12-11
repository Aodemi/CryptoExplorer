import { Router } from "express";
import { listCryptos } from "../controllers/crypto.controller";
import { listCryptosDB } from "../controllers/listCrypto.controller";
import { authRequired } from "../middlewares/auth";
import { rechercherCrypto } from "../controllers/listCrypto.controller";
import {analyseCrypto } from "../controllers/cryptoAnalyse.controller"
import { dashboardController } from "../controllers/dashboard.controller";


const router = Router();

router.get("/", authRequired, listCryptos);
router.get("/api", listCryptosDB); // Liste des cryptos

router.get("/search/:name", rechercherCrypto); // Recherche
router.get("/analyse/:id", analyseCrypto);   // Analyse + note crypto 

router.get("/dashboard", dashboardController); // Dashboard

export default router;
