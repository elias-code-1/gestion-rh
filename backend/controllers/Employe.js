const mongoose = require('mongoose');
const Employe = require('../models/Employe');
const AuditLog = require('../models/AuditLog');

exports.createEmploye = async (req, res, next) => {
  try {
    const employe = new Employe({ ...req.body });
    const saved = await employe.save();

    await AuditLog.create({
      action: 'Création collaborateur',
      auteur: 'Gestionnaire RH',
      details: `Ajout en base de ${saved.prenom} ${saved.nom} (${saved.poste || 'Salarié'})`,
      type: 'creation',
    }).catch(() => {});

    return res.status(201).json(saved);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
};

exports.getEmploye = async (req, res, next) => {
  try {
    const employes = await Employe.find().sort({ createdAt: -1 });
    return res.status(200).json(employes);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
};

exports.getEmployeById = async (req, res, next) => {
  try {
    const employe = await Employe.findById(req.params.id);
    if (!employe) {
      return res.status(404).json({ error: 'Collaborateur introuvable.' });
    }
    return res.status(200).json(employe);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
};

exports.deleteEmploye = async (req, res, next) => {
  try {
    const emp = await Employe.findById(req.params.id);
    const result = await Employe.deleteOne({ _id: req.params.id });

    if (emp) {
      await AuditLog.create({
        action: 'Suppression collaborateur',
        auteur: 'Gestionnaire RH',
        details: `Suppression du dossier de ${emp.prenom} ${emp.nom}`,
        type: 'suppression',
      }).catch(() => {});
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
};

exports.editEmploye = async (req, res, next) => {
  try {
    const result = await Employe.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    await AuditLog.create({
      action: 'Mise à jour collaborateur',
      auteur: 'Gestionnaire RH',
      details: `Mise à jour de la fiche de ${result.prenom} ${result.nom}`,
      type: 'modification',
    }).catch(() => {});

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
};
