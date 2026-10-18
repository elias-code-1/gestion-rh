const mongoose = require('mongoose');

const etapeSchema = mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  terminee: { type: Boolean, default: false },
  dateValidation: { type: String },
});

const onboardingSchema = mongoose.Schema(
  {
    employeId: { type: mongoose.Schema.Types.Mixed, required: true },
    employeNom: { type: String },
    phase: {
      type: String,
      enum: ['onboarding', 'offboarding'],
      default: 'onboarding',
    },
    dateDebut: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    tuteur: { type: String },
    etapes: [etapeSchema],
    statut: {
      type: String,
      enum: ['en_cours', 'termine'],
      default: 'en_cours',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Onboarding', onboardingSchema);
