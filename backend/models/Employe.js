const mongoose = require('mongoose');

const employeSchema = mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true },
    telephone: { type: String },
    poste: { type: String },
    departement: { type: String },
    dateEmbauche: { type: Date, default: Date.now },
    statut: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
    salaireBrut: { type: Number, default: 3500 },
    typeContrat: { type: String, default: 'CDI' },
    visiteMedicale: { type: Date },
    teletravailJours: { type: Number, default: 2 },
    competences: [
      {
        nom: { type: String },
        niveau: { type: String, default: 'Avancé' },
      },
    ],
    contactUrgence: {
      nom: { type: String },
      telephone: { type: String },
      lien: { type: String },
    },
    iban: { type: String },
    secuSociale: { type: String },
    nationalite: { type: String, default: 'Française' },
    matricule: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employe', employeSchema);