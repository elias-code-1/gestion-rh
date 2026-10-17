# Dossier RH — Frontend

Frontend statique (HTML/CSS/JS pur, sans framework) pour une app de gestion RH :
**Employés**, **Absences**, **Congés**. Prêt à être branché sur un backend
Node.js / Express / MongoDB (Mongoose) que tu vas construire toi-même.

## Structure

```
gestion-rh/
├── frontend/                  (ce dossier)
│   ├── index.html              Tableau de bord (compteurs + dernières demandes de congé)
│   ├── employes.html            CRUD Employés
│   ├── absences.html             CRUD Absences
│   ├── conges.html                CRUD Congés
│   ├── README.md
│   ├── css/
│   │   └── style.css              Tous les styles (thème "registre")
│   └── js/
│       ├── api.js                 Client fetch générique (GET/POST/PUT/DELETE)
│       ├── dashboard.js            Logique du tableau de bord
│       ├── employes.js             Logique CRUD Employés
│       ├── absences.js             Logique CRUD Absences
│       └── conges.js               Logique CRUD Congés
└── backend/                    (à créer par toi : Node.js / Express / Mongoose)
```

Un fichier JS par fonctionnalité comme demandé — pas de framework, pas de build,
tu ouvres directement les `.html` (ou via `live-server` / une extension VS Code).

## Configurer l'URL de l'API

Dans `js/api.js` :

```js
const API_BASE_URL = 'http://localhost:5000/api';
```

Change cette valeur quand ton backend Express tourne (port différent, déploiement, etc.).
Toutes les pages passent par cette même constante.

## Routes REST attendues côté backend

### Employés
| Méthode | Route              | Description        |
|---------|---------------------|---------------------|
| GET     | `/api/employes`      | Liste des employés  |
| POST    | `/api/employes`      | Créer un employé    |
| PUT     | `/api/employes/:id`  | Modifier un employé |
| DELETE  | `/api/employes/:id`  | Supprimer un employé|

Champs envoyés par le formulaire : `nom, prenom, email, telephone, poste,
departement, dateEmbauche, statut ('actif' | 'inactif')`.

### Absences
| Méthode | Route               | Description         |
|---------|----------------------|----------------------|
| GET     | `/api/absences`       | Liste des absences   |
| POST    | `/api/absences`       | Créer une absence    |
| PUT     | `/api/absences/:id`   | Modifier une absence |
| DELETE  | `/api/absences/:id`   | Supprimer une absence|

Champs : `employeId, date, motif, justifiee (bool), commentaire`.
Si tu renvoies aussi `employeNom` depuis le backend (via `populate` Mongoose),
le tableau l'affichera directement sans requête supplémentaire.

### Congés
| Méthode | Route              | Description           |
|---------|---------------------|------------------------|
| GET     | `/api/conges`        | Liste des congés       |
| POST    | `/api/conges`        | Créer une demande      |
| PUT     | `/api/conges/:id`    | Modifier une demande   |
| DELETE  | `/api/conges/:id`    | Supprimer une demande  |

Champs : `employeId, typeConge ('paye'|'maladie'|'exceptionnel'|'sans_solde'),
dateDebut, dateFin, statut ('en_attente'|'approuve'|'refuse'), commentaire`.

Toutes les réponses `GET` doivent renvoyer un tableau JSON d'objets, chacun
avec un champ `_id` (c'est ce que Mongoose fournit par défaut).

## CORS

N'oublie pas `app.use(cors())` côté Express, sinon le navigateur bloquera les
appels depuis ce frontend (servi sur une autre origine que l'API).

## Prochaines étapes possibles

- Authentification (login RH) avant d'accéder aux pages
- Pagination / recherche sur les tableaux
- Export CSV des absences et congés
- Validation plus poussée côté client (formats téléphone, etc.)
