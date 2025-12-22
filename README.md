# CryptoExplorer

## Guide de démarrage

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

### Gestion des utilisateurs

- Dans postman, lancer la route : 
```
http://localhost:3001/api/admin/create-admin
```

- Connectez vous avec les infos suivantes  :
email: "admin@gmail.com",
password: "admin123"


### Tests
Installer Jest
```
npm install --save-dev jest ts-jest @types/jest @types/node
```
Ces tests ont été effectués a partir d'une base de donnée distante (appellée dbtest). Entre les tests, on nettoie la bd et a la fin des tests, on ferme la connexion qu'on a ouverte avant le début des tests



 Tests avec base de données réelle, nettoyage automatique entre tests, vérification des données persistées.

 #### Tests de gestions d'utilisateurs (AdminController)


1- Creation de l'admin : Verifie si l'admin a bel et bien été crée et si son username est bel et bien admin
2- Liste des utilisateurs : Cree des utilisateur et s'Assure qu'il ya au moins 1 utilisateur affiché et son email corresponds a l'email de l'user crée
3- Suppression d'un utilisateur : Cree un utilisateur, le supprime et s'assure qu'il a bel et bein affiché le message de suppression et qu'il est maintenant NULL
4- Modifier le role d'un utilisateur: Cree un utilisateur et modifie son rolet pour ensuite s'Assurer que son role a bel et bien changé 

 #### Tests pour la liste de cryptomonnaies (ListCryptoController)

1- Liste des cryptomonnaies : Cree 2 crypto, les listes et s'Assure que le nombre de cryptomonnaie correspond au nombre de cryptos crée/importés




