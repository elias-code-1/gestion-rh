const mongoose = require('mongoose');

const employeSchema = mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: String },
  poste: { type: String },
  departement: { type: String },
  dateEmbauche: { type: Date },
  statut: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
});

module.exports = mongoose.model('Employe', employeSchema);