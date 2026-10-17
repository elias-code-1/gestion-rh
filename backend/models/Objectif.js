const mongoose = require('mongoose');

const objectifSchema = mongoose.Schema(
  {
    employeId: { type: mongoose.Schema.Types.Mixed, required: true },
    employeNom: { type: String },
    titre: { type: String, required: true },
    description: { type: String },
    trimestre: { type: String, default: 'Q4 2026' },
    progression: { type: Number, default: 0, min: 0, max: 100 },
    echeance: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    statut: {
      type: String,
      enum: ['non_demarre', 'en_cours', 'atteint', 'depasse', 'abandonne'],
      default: 'en_cours',
    },
    poids: { type: Number, default: 25 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Objectif', objectifSchema);
