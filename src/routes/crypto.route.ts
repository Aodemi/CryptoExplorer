import { Router } from "express";
import { listCryptos } from "../controllers/crypto.controller";
import { listCryptosAPI } from "../controllers/listCrypto.controller";
import { authRequired } from "../middlewares/auth";
import { rechercherCrypto } from "../controllers/listCrypto.controller";
import {analyseCrypto } from "../controllers/cryptoAnalyse.controller"
import { getSuccessScore } from "../controllers/cryptoNote.controller";


const router = Router();

router.get("/", authRequired, listCryptos);
router.get("/api", listCryptosAPI); 

router.get("/search", rechercherCrypto);
router.get("/:id/analyse", analyseCrypto);     

router.get("/success-score", getSuccessScore);

export default router;
