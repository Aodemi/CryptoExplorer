# CryptoExplorer

## Démarrage

1. Copier `.env.example` en `.env` et ajuster les variables.
2. Installer les dépendances.
3. Lancer en développement.
4. Changer de répertoire pour aller dans le dossier frontend et recommencer.

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

## Endpoints
- `GET /api/markets` — Données de marché en direct depuis CoinGecko
- `POST /api/markets/convertToNewModel` — Convertit les marchés live en entrées stockées (snapshots)
- `GET /api/cryptos` — Liste des cryptomonnaies stockées

- `POST /api/admin/create-admin` — Crée l'admin
- `GET /api/admin/users` — Liste des utilisateurs stockées
- `DELETE /api/admin/users/:id` — Supprimer un utilisateur
- `PATCH /api/admin/:id/role` — Modifie le role d'un user

## Config
- CORS / limite de requêtes via `config/default.json`
- Connexion Mongo via `MONGO_URI` (.env)

## Build / Démarrage
```powershell
npm run build
npm start
```

## Gestion des utilisateurs
Dans postman, lancer la route : 
http://localhost:3001/api/admin/create-admin

Connectez vous avec les infos suivantes  :
email: "admin@gmail.com",
password: "test123