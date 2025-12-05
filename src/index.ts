import dotenv from "dotenv";
dotenv.config({ override: true });

import { httpServer, httpsServer } from "./server";
import configLib from "config";
import type { ServerCfg } from "./config/config.type";
import { connectDB } from "./config/db";
import http from "http";
import { importMarketsToDB } from "./utils/importMarkets"; 

const srv = (configLib.has("server") ? configLib.get<ServerCfg>("server") : {
  trustProxy: false,
  http: { enabled: true, port: Number(process.env.PORT) || 3001 },
  https: { enabled: false, port: 3443, redirectAllHttpToHttps: false, cert: { keyPath: "", certPath: "" } }
}) as ServerCfg;

let protocol: "http" | "https" = "http";
let port = srv.http.port;
let server: any = httpServer;

if (srv.https.enabled && httpsServer) {
  protocol = "https";
  port = srv.https.port;
  server = httpsServer;
}

connectDB().then(async () => {
  console.log("MongoDB connecté !");

  // 🔹 AJOUT : import automatique des cryptos dès le démarrage
  await importMarketsToDB();

  server.listen(port, () => {
    console.log(`Server listening at ${protocol}://localhost:${port}`);
  });

  if (srv.https.enabled && srv.https.redirectAllHttpToHttps) {
    const redirect = http.createServer((req, res) => {
      const host = req.headers.host ? req.headers.host.split(":")[0] : "localhost";
      res.writeHead(301, { Location: `https://${host}:${srv.https.port}${req.url}` });
      res.end();
    });
    redirect.on("error", (err: any) => {
      if ((err as any).code === "EADDRINUSE") {
        console.error(`HTTP port ${srv.http.port} for redirect is already in use.`);
        return;
      }
      console.error("HTTP redirect error:", err);
    });
    redirect.listen(srv.http.port, () => {
      console.log(`HTTP redirect server at http://localhost:${srv.http.port}`);
    });
  }
});
