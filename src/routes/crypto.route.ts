import { Router } from "express";
import { listCryptos } from "../controllers/crypto.controller";
import { authRequired } from "../middlewares/auth";

const router = Router();

router.get("/", authRequired, listCryptos);

export default router;
