# CryptoExplorer — Dossier de Soumission

Ce dossier contient les fichiers pour la documentation complète.

Contenu:
- README du projet (copie)
- Swagger (API OpenAPI)
- Postman collection + environnement local
- Configuration par défaut
- Exemple d’environnement (.env.example)

Instructions pour logs et couverture:
- Générer logs:
  - `New-Item -ItemType Directory -Force -Path .\logs`
  - `npm run dev | Tee-Object -FilePath .\logs\server.log`
  - `npm run populateDB | Tee-Object -FilePath .\logs\populate.log`
  - `npm run load:test | Tee-Object -FilePath .\logs\loadtest.log`
- Générer couverture de tests:
  - `npm test -- --coverage`
  - Copiez `coverage/coverage-summary.json` ici si requis.

Notes:
- Les endpoints protégés nécessitent un JWT.
- MongoDB doit être démarré avant les commandes.
