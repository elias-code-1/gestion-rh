# Dossier RH

Application de gestion des ressources humaines avec une vitrine d’accueil, un tableau de bord et des espaces pour les collaborateurs, les congés, les absences, les entretiens, les formations et les opérations RH.

## Stack technique

- **Frontend** : React, TypeScript, Vite, Tailwind CSS et Lucide
- **Backend** : Node.js, Express et Mongoose
- **Base de données** : MongoDB

Les pages HTML dans `frontend/` sont conservées pour l’ancienne interface. L’application React se trouve dans `src/`.

## Prérequis

- Node.js 18 ou plus récent
- npm
- Une instance MongoDB pour utiliser les fonctions de persistance

## Installation et lancement

Depuis la racine du dépôt :

```bash
npm install
npm install --prefix backend
npm run dev
```

La commande `npm run dev` construit l’interface puis démarre le serveur Express. Ouvrez ensuite [http://localhost:3000](http://localhost:3000), ou le port défini par `PORT`.

Pour conserver les sources de configuration locales, créez ou complétez `backend/.env` :

```dotenv
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gestion-rh
```

Remplacez l’URI par celle de votre instance MongoDB. Le serveur peut démarrer sans `MONGODB_URI`, mais les routes qui enregistrent des données nécessitent une connexion à MongoDB.

## Commandes utiles

| Commande | Description |
| --- | --- |
| `npm run dev` | Construit l’interface et démarre le serveur Express |
| `npm start` | Démarre le serveur Express (après un build avec `npm run build`) |
| `npm run build` | Génère l’interface de production dans `dist/` |
| `npm run lint` | Vérifie les types TypeScript |

## Fonctionnalités

- Tableau de bord RH et indicateurs
- Dossiers collaborateurs et organigramme
- Congés, absences, calendrier et feuilles de temps
- Onboarding, entretiens, compétences, formations et objectifs
- Salaires, primes, notes de frais et titres-restaurant
- Documents, matériels, alertes, registre du personnel et journal d’audit

## API

L’API est servie sur le même hôte que l’application sous `/api`. Les données métier sont persistées par MongoDB via Mongoose.

## Auteur

[elias-code-1](https://github.com/elias-code-1)
