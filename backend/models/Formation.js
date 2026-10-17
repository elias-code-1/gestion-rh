const mongoose = require('mongoose');

const formationSchema = mongoose.Schema(
  {
    employeId: { type: mongoose.Schema.Types.Mixed, required: true },
    employeNom: { type: String },
    titre: { type: String, required: true },
    organisme: { type: String, required: true },
    cout: { type: Number, default: 0 },
    dureeJours: { type: Number, default: 1 },
    datePrevue: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    statut: {
      type: String,
      enum: ['en_attente', 'validee', 'terminee', 'refusee'],
      default: 'en_attente',
    },
    competenceVisee: { type: String },
    commentaire: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Formation', formationSchema);
