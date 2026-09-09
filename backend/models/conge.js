const mongoose = require('mongoose');

const congeSchema = mongoose.Schema({
  employeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employe', required: true },
  employeNom: { type: String },
  typeConge: {
    type: String,
    enum: ['paye', 'maladie', 'exceptionnel', 'sans_solde'],
    required: true,
  },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  statut: {
    type: String,
    enum: ['en_attente', 'approuve', 'refuse'],
    default: 'en_attente',
  },
  commentaire: { type: String },
});

module.exports = mongoose.model('Conge', congeSchema);