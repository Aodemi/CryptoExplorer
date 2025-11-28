import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3001,
  sslKeyPath: process.env.SSL_KEY_PATH || '',
  sslCertPath: process.env.SSL_CERT_PATH || '',
  jwtSecret: process.env.JWT_SECRET || 'secret_par_defaut_pour_jwt',
  databaseUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/crypto_explorer',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  coingeckoApiKey: process.env.COINGECKO_API_KEY || ''
};
