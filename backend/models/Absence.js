const mongoose = require('mongoose');

const absenceSchema = mongoose.Schema({
  employeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employe', required: true },
  employeNom: { type: String },
  date: { type: Date, required: true },
  motif: { type: String },
  justifiee: { type: Boolean, default: false },
  commentaire: { type: String },
});

module.exports = mongoose.model('Absence', absenceSchema);