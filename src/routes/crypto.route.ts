import { Router } from "express";
import { listCryptos } from "../controllers/crypto.controller";
import { listCryptosAPI } from "../controllers/listCrypto.controller";
import { authRequired } from "../middlewares/auth";

const router = Router();

router.get("/", authRequired, listCryptos);
router.get("/api", listCryptosAPI); 

export default router;
