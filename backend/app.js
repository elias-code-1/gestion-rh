require('dotenv').config();
console.log('URI chargée:', process.env.MONGODB_URI);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Employe = require('./models/Employe');
const Absence = require('./models/Absence');
const Conge = require('./models/conge');


const app = express();

// --- Connexion MongoDB ---------------------------------------------------
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Erreur de connexion MongoDB :', error));

// --- Middlewares -----------------------------------------------------------
app.use(cors());
app.use(express.json());

// ============================================================================
// ROUTES EMPLOYÉS — base : /api/employes
//   GET    /api/employes       -> tableau d'employés
//   POST   /api/employes       -> crée un employé, retourne l'employé créé
//   PUT    /api/employes/:id
//   DELETE /api/employes/:id
// ============================================================================

// TODO: app.post('/api/employes', ...)

app.post('/api/employes', (req, res, next) => {
    const employes = new Employe ({
        ...req.body
    });
    employes.save()
    .then(employes => res.status(201).json(employes))
    .catch(error => res.status(400).json({error}));
})
// TODO: app.get('/api/employes', ...)

app.get('/api/employes', (req, res, next) => {
   Employe.find()
   .then(employes => res.status(200).json(employes))
   .catch(error => res.status(400).json({error})); 
});
// TODO: app.put('/api/employes/:id', ...)
 app.put('/api/employes/:id', (req, res, next) => {
    Employe.updateOne({ _id: req.params.id }, ({  ...req.body, _id: req.params.id }))
    .then(employes => res.status(200).json(employes))
    .catch(error => res.status(400).json({error}));
 });

// TODO: app.delete('/api/employes/:id', ...)
 
app.delete('/api/employes/:id', (req, res, next) => {
    Employe.deleteOne({ _id: req.params.id})
    .then(employes => res.status(200).json(employes))
    .catch(error => res.status(400).json({error}));
});

// ============================================================================
// ROUTES ABSENCES — base : /api/absences
// ============================================================================

// TODO: app.get('/api/absences', ...)
app.get('/api/absences', (req, res, next) => {
    Absence.find()
    .then(absences => res.status(200).json(absences))
    .catch(error => res.status(400).json({error}));
});
// TODO: app.post('/api/absences', ...)

app.post('/api/absences', (req, res, next) => {
    const absences = new Absence ({
        ...req.body
    });
    absences.save()
    .then(absences => res.status(201).json(absences))
    .catch(error => res.status(400).json({error}))
});
// TODO: app.put('/api/absences/:id', ...)
app.put('/api/absences/:id', (req, res, next) => {
    Absence.updateOne({ _id: req.params.id }, ({  ...req.body, _id: req.params.id }))
    .then(absences => res.status(200).json(absences))
    .catch(error => res.status(400).json({error}));
 });
// TODO: app.delete('/api/absences/:id', ...)
app.delete('/api/absences/:id', (req, res, next) => {
    Absence.deleteOne({ _id: req.params.id})
    .then(absences => res.status(200).json(absences))
    .catch(error => res.status(400).json({error}));
});


// ============================================================================
// ROUTES CONGÉS — base : /api/conges
// ============================================================================

// TODO: app.get('/api/conges', ...)
app.get('/api/conges', (req, res, next) => {
    Conge.find()
    .then(conges => res.status(200).json(conges))
    .catch(error => res.status(400).json({error}));
});
// TODO: app.post('/api/conges', ...)

app.post('/api/conges', (req, res, next) => {
    const conge = new Conge ({
        ...req.body
    });
    conge.save()
    .then(conge => res.status(201).json(conge))
    .catch(error => res.status(400).json({error}))
});
// TODO: app.put('/api/conges/:id', ...)
app.put('/api/conges/:id', (req, res, next) => {
    Conge.updateOne({ _id: req.params.id }, ({  ...req.body, _id: req.params.id }))
    .then(conge => res.status(200).json(conge))
    .catch(error => res.status(400).json({error}));
 });
// TODO: app.delete('/api/conges/:id', ...)
app.delete('/api/conges/:id', (req, res, next) => {
    Conge.deleteOne({ _id: req.params.id})
    .then(conge => res.status(200).json(conge))
    .catch(error => res.status(400).json({error}));
});

module.exports = app;