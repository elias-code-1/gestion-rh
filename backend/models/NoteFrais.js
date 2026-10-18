const mongoose = require('mongoose');

const noteFraisSchema = mongoose.Schema(
  {
    employeId: { type: mongoose.Schema.Types.Mixed, required: true },
    employeNom: { type: String },
    titre: { type: String, required: true },
    montant: { type: Number, required: true },
    dateDepense: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    categorie: {
      type: String,
      enum: ['transport', 'repas', 'hebergement', 'logiciel', 'autre'],
      default: 'repas',
    },
    statut: {
      type: String,
      enum: ['en_attente', 'validee', 'remboursee', 'refusee'],
      default: 'en_attente',
    },
    justificatif: { type: String },
    remarque: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NoteFrais', noteFraisSchema);
