const mongoose = require('mongoose');

const entretienSchema = mongoose.Schema(
  {
    employeId: { type: mongoose.Schema.Types.Mixed, required: true },
    employeNom: { type: String },
    type: {
      type: String,
      enum: ['annuel', 'professionnel', 'fin_periode_essai', 'reprise_activite'],
      default: 'annuel',
    },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    evaluator: { type: String, default: 'Directeur RH' },
    noteGlobale: { type: Number, default: 4, min: 1, max: 5 },
    statut: {
      type: String,
      enum: ['a_planifier', 'planifie', 'realise'],
      default: 'planifie',
    },
    objectifs: { type: String },
    souhaitsEvolution: { type: String },
    remarques: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Entretien', entretienSchema);
