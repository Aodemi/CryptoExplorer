# CryptoExplorer

## Démarrage

1. Copier `.env.example` en `.env` et ajuster les variables.
2. Installer les dépendances.
3. Lancer en développement.

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

## Endpoints
- `GET /api/markets` — Données de marché en direct depuis CoinGecko
- `POST /api/markets/convertToNewModel` — Convertit les marchés live en entrées stockées (snapshots)
- `GET /api/cryptos` — Liste des cryptomonnaies stockées

## Config
- CORS / limite de requêtes via `config/default.json`
- Connexion Mongo via `MONGO_URI` (.env)

## Build / Démarrage
```powershell
npm run build
npm start
```