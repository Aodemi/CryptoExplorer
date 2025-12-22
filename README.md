# CryptoExplorer

Ce guide vous indique comment lancer le projet, appeler les endpoints, et importer les données de marché. Vous devez suivre les étapes ci‑dessous pour une mise en route rapide.

## Prérequis
- Vous devez avoir Node.js et npm installés.
- Vous devez avoir MongoDB en local (par défaut: `mongodb://localhost:27017`).
- Vous devez disposer d’une clé CoinGecko (facultatif, le projet inclut une clé par défaut pour les tests).

## Installation et démarrage (backend + frontend)
Vous devez préparer l’environnement, installer les dépendances et démarrer les deux parties.

```powershell
# Backend
Copy-Item .env.example .env
npm install
npm run dev

# Frontend
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Pour un build de production backend:
```powershell
npm run build
npm start
```

## Import des MarketSnapshots (3 mois)
Vous devez importer les données de marché soit en lançant le script, soit en important le fichier fourni.

Option A — Script automatique:
- Le script efface les snapshots existants puis importe ~90 jours pour les 50 principales cryptos.
```powershell
npm run populateDB
```

Option B — Import depuis un fichier fourni (data)
- Si vous avez reçu un fichier JSON dans le dossier `data` avec le rapport, vous devez l’importer manuellement dans mongoDB.

## Endpoints principaux (backend)
Vous devez remplacer l’hôte selon votre environnement (local ou déployé). Les routes protégées nécessitent un `token` JWT.

- Public:
	- `GET /` — Ping
	- `GET /api/cryptos` — Liste des cryptos
	- `GET /api/markets` — Données de marché en direct (CoinGecko)

- Authentification:
	- `POST /api/auth/register` — Inscription
	- `POST /api/auth/login` — Connexion (retourne `token`)

- Favoris / Profil:
	- `GET /api/user/me` — Profil utilisateur
	- `POST /api/user/favorites` — Ajouter un favori
	- `GET /api/user/favorites` — Lister les favoris
	- `DELETE /api/user/favorites/:id` — Retirer un favori

- Admin:
	- `POST /api/admin/create-admin` — Créer l’admin initial
	- `GET /api/admin/users` — Lister les utilisateurs
	- `DELETE /api/admin/users/:id` — Supprimer un utilisateur
	- `PATCH /api/admin/:id/role` — Modifier le rôle d’un utilisateur

## Postman et Swagger
Vous devez utiliser ces documents pour valider l’API.
- Swagger: [docs/swagger.json](docs/swagger.json)
- Postman: [docs/postman/CryptoExplorer.postman_collection.json](docs/postman/CryptoExplorer.postman_collection.json)
- Environnements Postman: [docs/postman/CryptoExplorer.local.postman_environment.json](docs/postman/CryptoExplorer.local.postman_environment.json)

## Configuration
Vous devez vérifier et adapter la configuration si nécessaire.
- Fichier: [config/default.json](config/default.json)
- Variables d’environnement: `.env` (ex: `MONGO_URI`, `JWT_SECRET`, `PORT`)

## Tests et charge
Vous devez exécuter les tests et le test de charge si demandé.
```powershell
npm test --verbose
npm run load:test
```

## Logs
Par défaut, les logs s’affichent en console. Vous devez produire des fichiers de logs via PowerShell si requis:
```powershell
New-Item -ItemType Directory -Force -Path .\logs
npm run dev | Tee-Object -FilePath .\logs\server.log
npm run populateDB | Tee-Object -FilePath .\logs\populate.log
npm run load:test | Tee-Object -FilePath .\logs\loadtest.log
```

## Notes
- Le script d’import attend 60s sur les erreurs 429 (limites CoinGecko). MongoDB doit être lancé.




