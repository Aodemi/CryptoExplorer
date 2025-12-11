import { Router } from "express";
import cryptoRoutes from "./crypto.route";
import marketsRoutes from "./markets.route";
import authRoutes from "./auth.route";
import adminRoutes from "./admin.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cryptos", cryptoRoutes);
router.use("/markets", marketsRoutes);
router.use("/admin", adminRoutes);

export default router;
