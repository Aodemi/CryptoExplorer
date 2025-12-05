import { Router } from "express";
import cryptoRoutes from "./crypto.route";
import marketsRoutes from "./markets.route";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cryptos", cryptoRoutes);
router.use("/markets", marketsRoutes);

export default router;
