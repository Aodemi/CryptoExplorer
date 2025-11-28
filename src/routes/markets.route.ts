import { Router } from "express";
import { convertToNewModel, listMarkets } from "../controllers/markets.controller";
import { authRequired } from "../middlewares/auth";

const router = Router();

router.get("/", authRequired, listMarkets);
router.post("/convertToNewModel", authRequired, convertToNewModel);

export default router;
