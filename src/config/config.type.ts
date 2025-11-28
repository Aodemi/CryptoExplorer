export type ServerCfg = {
  trustProxy: boolean;
  http: { enabled: boolean; port: number };
  https: {
    enabled: boolean; port: number; redirectAllHttpToHttps: boolean;
    cert: { keyPath: string; certPath: string; passphrase?: string }
  };
};
