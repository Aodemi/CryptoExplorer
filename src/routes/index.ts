import { Router } from "express";
import cryptoRoutes from "./crypto.route";
import marketsRoutes from "./markets.route";
import authRoutes from "./auth.route";
import adminRoutes from "./admin.route";
import userRoutes from "./user.route";
const router = Router();

router.use("/auth", authRoutes);
router.use("/cryptos", cryptoRoutes);
router.use("/markets", marketsRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
export default router;
