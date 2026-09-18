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
app.use(cors());
app.use(express.json());



app.use('/api/employes', employeRoutes);
app.use('/api/absences', absenceRoutes);
app.use('/api/conges', congeRoutes);
module.exports = app;