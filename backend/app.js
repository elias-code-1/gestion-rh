require('dotenv').config();
console.log('URI chargée:', process.env.MONGODB_URI);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = express.Router();
const congeRoutes = require('./routes/conge');
const employeRoutes = require('./routes/Employe');
const absenceRoutes = require('./routes/Absence');


const Employe = require('./models/Employe');
const Absence = require('./models/Absence');
const Conge = require('./models/conge');


const app = express();

// --- Connexion MongoDB ---------------------------------------------------
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Erreur de connexion MongoDB :', error));

// --- Middlewares -----------------------------------------------------------
router.use(cors());
router.use(express.json());

// ============================================================================
// ROUTES EMPLOYÉS — base : /api/employes
//   GET    /api/employes       -> tableau d'employés
//   POST   /api/employes       -> crée un employé, retourne l'employé créé
//   PUT    /api/employes/:id
//   DELETE /api/employes/:id
// ============================================================================

// TODO: app.post('/api/employes', ...)

router.post('/api/employes',Ctrl.createEmploye)
// TODO: app.get('/api/employes', ...)

router.get('/api/employes', getEmploye);
// TODO: app.put('/api/employes/:id', ...)
 app.put('/api/employes/:id', editEmploye);

// TODO: app.delete('/api/employes/:id', ...)
 
router.delete('/api/employes/:id',deleteEmploye);

// ============================================================================
// ROUTES ABSENCES — base : /api/absences
// ============================================================================

// TODO: app.get('/api/absences', ...)
router.get('/api/absences', (req, res, next) => {
    Absence.find()
    .then(absences => res.status(200).json(absences))
    .catch(error => res.status(400).json({error}));
});
// TODO: app.post('/api/absences', ...)

router.post('/api/absences', (req, res, next) => {
    const absences = new Absence ({
        ...req.body
    });
    absences.save()
    .then(absences => res.status(201).json(absences))
    .catch(error => res.status(400).json({error}))
});
// TODO: app.put('/api/absences/:id', ...)
router.put('/api/absences/:id', (req, res, next) => {
    Absence.updateOne({ _id: req.params.id }, ({  ...req.body, _id: req.params.id }))
    .then(absences => res.status(200).json(absences))
    .catch(error => res.status(400).json({error}));
 });
// TODO: app.delete('/api/absences/:id', ...)
router.delete('/api/absences/:id', (req, res, next) => {
    Absence.deleteOne({ _id: req.params.id})
    .then(absences => res.status(200).json(absences))
    .catch(error => res.status(400).json({error}));
});


// ============================================================================
// ROUTES CONGÉS — base : /api/conges
// ============================================================================

// TODO: app.get('/api/conges', ...)
router.get('/api/conges', (req, res, next) => {
    Conge.find()
    .then(conges => res.status(200).json(conges))
    .catch(error => res.status(400).json({error}));
});
// TODO: app.post('/api/conges', ...)

router.post('/api/conges', (req, res, next) => {
    const conge = new Conge ({
        ...req.body
    });
    conge.save()
    .then(conge => res.status(201).json(conge))
    .catch(error => res.status(400).json({error}))
});
// TODO: app.put('/api/conges/:id', ...)
router.put('/api/conges/:id', (req, res, next) => {
    Conge.updateOne({ _id: req.params.id }, ({  ...req.body, _id: req.params.id }))
    .then(conge => res.status(200).json(conge))
    .catch(error => res.status(400).json({error}));
 });
// TODO: app.delete('/api/conges/:id', ...)
router.delete('/api/conges/:id', (req, res, next) => {
    Conge.deleteOne({ _id: req.params.id})
    .then(conge => res.status(200).json(conge))
    .catch(error => res.status(400).json({error}));
});

app.use('/api/employes', employeRoutes);
app.use('/api/absences', absenceRoutes);
app.use('/api/conges', congeRoutes);
module.exports = app;