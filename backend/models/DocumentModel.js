const mongoose = require('mongoose');

const documentSchema = mongoose.Schema(
  {
    titre: { type: String, required: true },
    categorie: {
      type: String,
      enum: ['contrat', 'attestation', 'avenant', 'politique', 'certificat'],
      default: 'attestation',
    },
    description: { type: String },
    contenuTemplate: { type: String, required: true },
    statut: {
      type: String,
      enum: ['actif', 'archive'],
      default: 'actif',
    },
    dernierUsage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
