import fs from "fs";
import path from "path";
import { config } from "../config";

export function loadCertificate() {
  const keyPath = config.sslKeyPath;
  const certPath = config.sslCertPath;
  if (!keyPath || !certPath) return undefined;

  try {
    const key = fs.readFileSync(path.resolve(keyPath));
    const cert = fs.readFileSync(path.resolve(certPath));
    return { key, cert } as any;
  } catch (e) {
    console.warn("Unable to load SSL certs, falling back to HTTP.");
    return undefined;
  }
}
