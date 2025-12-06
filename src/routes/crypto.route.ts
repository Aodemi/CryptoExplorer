import { Router } from "express";
import { listCryptos } from "../controllers/crypto.controller";
import { listCryptosAPI } from "../controllers/listCrypto.controller";
import { authRequired } from "../middlewares/auth";
import { rechercherCrypto } from "../controllers/listCrypto.controller";

const router = Router();

router.get("/", authRequired, listCryptos);
router.get("/api", listCryptosAPI); 

router.get("/search", rechercherCrypto);


export default router;
