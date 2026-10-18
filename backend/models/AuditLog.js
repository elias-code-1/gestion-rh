const mongoose = require('mongoose');

const auditLogSchema = mongoose.Schema(
  {
    horodatage: { type: Date, default: Date.now },
    action: { type: String, required: true },
    auteur: { type: String, default: 'Gestionnaire RH' },
    details: { type: String },
    type: { type: String, default: 'modification' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
