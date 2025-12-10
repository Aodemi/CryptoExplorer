import { Router } from "express";
import { listCryptos } from "../controllers/crypto.controller";
import { listCryptosAPI } from "../controllers/listCrypto.controller";
import { authRequired } from "../middlewares/auth";
import { rechercherCrypto } from "../controllers/listCrypto.controller";
import {analyseCrypto } from "../controllers/cryptoAnalyse.controller"
import { dashboardController } from "../controllers/dashboard.controller";


const router = Router();

router.get("/", authRequired, listCryptos);
router.get("/api", listCryptosAPI); 

router.get("/search", rechercherCrypto);
router.get("/analyse/:id", analyseCrypto);     

router.get("/dashboard", dashboardController);

export default router;
