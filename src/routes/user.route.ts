import { Router } from "express";
import { authRequired } from "../middlewares/auth";
import { listFavorites, addFavorite, removeFavorite } from "../controllers/user.controller";

const router = Router();

router.get("/favorites", authRequired, listFavorites);
router.post("/favorites", authRequired, addFavorite);
router.delete("/favorites/:coinId", authRequired, removeFavorite);

export default router;
