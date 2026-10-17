# Gestion RH

Application de gestion des ressources humaines : suivi des employés, des absences et des congés. Développée pour pratiquer la construction d'une API REST avec Node.js, Express et MongoDB (Mongoose), connectée à un frontend HTML/CSS/JS vanilla.

## Fonctionnalités

- **Employés** : création, consultation, modification et suppression des fiches employés (nom, poste, département, date d'embauche, statut)
- **Absences** : déclaration et suivi des absences, rattachées à un employé
- **Congés** : demandes de congés (payé, maladie, exceptionnel, sans solde) avec statut (en attente / approuvé / refusé)
- **Dashboard** : vue d'ensemble de l'activité RH

## Stack technique

**Backend**
- Node.js / Express
- MongoDB Atlas via Mongoose
- CORS pour la communication avec le frontend

**Frontend**
- HTML / CSS / JavaScript vanilla (pas de framework)
- Un fichier JS dédié par page/fonctionnalité (`employes.js`, `absences.js`, `conges.js`, `dashboard.js`)
- `api.js` : client HTTP partagé (fetch wrapper) pour tous les appels à l'API

## Structure du projet

```
gestion-rh/
├── backend/
│   ├── models/
│   │   ├── Employe.js
│   │   ├── Absence.js
│   │   └── Conge.js
│   ├── app.js          # config Express + routes CRUD
│   ├── server.js        # démarrage du serveur HTTP
│   └── package.json
└── frontend/
    ├── index.html
    ├── employes.html
    ├── absences.html
    ├── conges.html
    ├── css/
    │   └── style.css
    └── js/
        ├── api.js
        ├── dashboard.js
        ├── employes.js
        ├── absences.js
        └── conges.js
```

## Installation

### Prérequis
- Node.js (v18 ou plus)
- Un cluster MongoDB Atlas (ou une instance MongoDB locale)

### Backend

```bash
cd backend
npm install
```

Crée un fichier `.env` à la racine de `backend/` :

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/gestion-rh?retryWrites=true&w=majority
PORT=5000
```

Lance le serveur :

```bash
npm start
```

Tu dois voir dans la console :
```
Server running on port: 5000
Connexion à MongoDB réussie !
```

### Frontend

Ouvre simplement `frontend/index.html` dans un navigateur, ou sers le dossier avec une extension type Live Server. Le frontend est configuré pour appeler l'API sur `http://localhost:5000/api`.

## API — Endpoints

### Employés
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/employes` | Liste tous les employés |
| POST | `/api/employes` | Crée un employé |
| PUT | `/api/employes/:id` | Modifie un employé |
| DELETE | `/api/employes/:id` | Supprime un employé |

### Absences
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/absences` | Liste toutes les absences |
| POST | `/api/absences` | Déclare une absence |
| PUT | `/api/absences/:id` | Modifie une absence |
| DELETE | `/api/absences/:id` | Supprime une absence |

### Congés
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/conges` | Liste toutes les demandes de congé |
| POST | `/api/conges` | Crée une demande de congé |
| PUT | `/api/conges/:id` | Modifie une demande de congé |
| DELETE | `/api/conges/:id` | Supprime une demande de congé |

## Auteur

[elias-code-1](https://github.com/elias-code-1)
