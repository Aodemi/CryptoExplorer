import express from "express";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";
import errorMiddleware from "./middlewares/error.middleware";
import cors from "cors";
import rateLimit from "express-rate-limit";
import configLib from "config";
import logger from "./utils/logger";
import router from "./routes";

const app = express();

app.use(express.json());

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

const corsOrigins = (configLib.has("security.cors.origins")
  ? (configLib.get("security.cors.origins") as string[])
  : ["http://localhost:4200", "http://localhost:3000"]) as string[];
app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true);
      return callback(null, corsOrigins.includes(origin));
    },
    credentials: true,
  })
);

const rlWindow = Number(configLib.has("security.rateLimit.windowMs") ? configLib.get("security.rateLimit.windowMs") : 15 * 60 * 1000);
const rlMax = Number(configLib.has("security.rateLimit.max") ? configLib.get("security.rateLimit.max") : 100);
const apiLimiter = rateLimit({ windowMs: rlWindow, max: rlMax, standardHeaders: true, legacyHeaders: false });
app.use("/api", apiLimiter);

const docsDir = path.join(__dirname, "../docs");
const swaggerPath = path.join(docsDir, "swagger.json");
if (fs.existsSync(swaggerPath)) {
  const spec = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));
  app.use("/docs", swaggerUi.serveFiles(spec, {}), swaggerUi.setup(spec));
  app.use("/docs/static", express.static(docsDir));
}

app.use("/api", router);

app.get("/", (_req, res) => res.json({ message: "API CryptoExplorer", base: "/api" }));

app.use(errorMiddleware);

export default app;
