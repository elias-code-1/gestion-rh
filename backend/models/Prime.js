const mongoose = require('mongoose');

const primeSchema = mongoose.Schema(
  {
    employeId: { type: mongoose.Schema.Types.Mixed, required: true },
    employeNom: { type: String },
    titre: { type: String, required: true },
    montant: { type: Number, required: true },
    dateVersement: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    motif: { type: String, default: 'Prime de performance' },
    statut: {
      type: String,
      enum: ['en_attente', 'validee', 'payee'],
      default: 'en_attente',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prime', primeSchema);
