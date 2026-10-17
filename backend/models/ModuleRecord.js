const mongoose = require('mongoose');

const moduleRecordSchema = mongoose.Schema(
  {
    moduleKey: { type: String, required: true, index: true },
    titre: { type: String, required: true },
    sousTitre: { type: String },
    employeId: { type: mongoose.Schema.Types.Mixed },
    employeNom: { type: String },
    statut: { type: String, default: 'actif' },
    priorite: { type: String },
    dateDebut: { type: String },
    dateFin: { type: String },
    montant: { type: Number },
    taux: { type: Number },
    categorie: { type: String },
    description: { type: String },
    tags: [{ type: String }],
    responsable: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ModuleRecord', moduleRecordSchema);
