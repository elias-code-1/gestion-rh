const mongoose = require('mongoose');

const timeLogSchema = mongoose.Schema(
  {
    employeId: { type: mongoose.Schema.Types.Mixed, required: true },
    employeNom: { type: String },
    semaine: { type: String, required: true }, // ex: "2026-W42"
    heuresDeclarees: { type: Number, default: 35 },
    heuresSupp: { type: Number, default: 0 },
    joursPresentiel: { type: Number, default: 3 },
    joursTeletravail: { type: Number, default: 2 },
    statut: {
      type: String,
      enum: ['en_attente', 'valide', 'rejete'],
      default: 'en_attente',
    },
    commentaire: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TimeLog', timeLogSchema);
