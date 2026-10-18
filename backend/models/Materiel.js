const mongoose = require('mongoose');

const materielSchema = mongoose.Schema(
  {
    employeId: { type: mongoose.Schema.Types.Mixed, required: true },
    employeNom: { type: String },
    type: {
      type: String,
      enum: ['ordinateur', 'smartphone', 'vehicule', 'ecran', 'accessoire', 'autre'],
      default: 'ordinateur',
    },
    nom: { type: String, required: true },
    numeroSerie: { type: String, required: true },
    dateAttribution: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    dateRestitution: { type: String },
    etat: {
      type: String,
      enum: ['comme_neuf', 'tres_bon', 'bon', 'usage'],
      default: 'tres_bon',
    },
    statut: {
      type: String,
      enum: ['attribue', 'restitue', 'en_reparation'],
      default: 'attribue',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Materiel', materielSchema);
