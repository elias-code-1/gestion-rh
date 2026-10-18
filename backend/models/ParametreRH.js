const mongoose = require('mongoose');

const parametreRHSchema = mongoose.Schema(
  {
    nomEntreprise: { type: String, default: 'Dossier RH Solutions' },
    siret: { type: String, default: '849 203 912 00018' },
    codeNAF: { type: String, default: '6201Z' },
    conventionCollective: { type: String, default: 'SYNTEC - Bureaux d’études techniques' },
    heuresHebdoLegales: { type: Number, default: 35 },
    joursCongesAnnuels: { type: Number, default: 25 },
    valeurFacialeTicketRestau: { type: Number, default: 10.5 },
    partPatronaleTicketRestau: { type: Number, default: 60 },
    seuilAlerteVisiteMedicaleJours: { type: Number, default: 30 },
    emailNotificationsRH: { type: String, default: 'rh@dossier-rh.fr' },
    responsableLegal: { type: String, default: 'Direction Générale' },
    adresseEntreprise: { type: String, default: '14 rue de la Paix, 75002 Paris' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ParametreRH', parametreRHSchema);
