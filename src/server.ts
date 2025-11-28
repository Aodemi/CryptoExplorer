import app from "./app";
import http from "http";
import https from "https";
import { loadCertificate } from "./middlewares/certificat.middleware";

const env = app.get("env");
console.log(`Environment: ${env}`);

const certOptions = loadCertificate();

const httpServer = http.createServer(app);
const httpsServer = certOptions ? https.createServer(certOptions, app) : undefined;

export { httpServer, httpsServer };
