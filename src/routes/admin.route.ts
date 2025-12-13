import { Router } from "express";
import { authRequired } from "../middlewares/auth";
import { usersList, deleteUser, modifyUserRole, createAdminUser } from "../controllers/admin.controller";

const router = Router();

router.get("/users", authRequired, (req: any, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Accès admin requis" });
  }
  next();
}, usersList);

router.delete("/users/:id", authRequired, (req: any, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Accès admin requis" });
  }
    next();
}, deleteUser);

router.patch("/users/:id/role", authRequired, (req: any, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Accès admin requis" });
  }
    next();
}, modifyUserRole);

router.post("/create-admin", createAdminUser); 

export default router;