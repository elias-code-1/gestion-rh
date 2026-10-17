const mongoose = require('mongoose');
const Conge = require('../models/conge');
const Employe = require('../models/Employe');
const AuditLog = require('../models/AuditLog');

exports.createConge = async (req, res, next) => {
  try {
    let employeNom = req.body.employeNom;
    if (!employeNom && req.body.employeId) {
      const emp = await Employe.findById(req.body.employeId).catch(() => null);
      if (emp) employeNom = `${emp.prenom} ${emp.nom}`;
    }

    const conge = new Conge({
      ...req.body,
      employeNom: employeNom || req.body.employeNom,
    });
    const saved = await conge.save();

    await AuditLog.create({
      action: 'Demande de congé',
      auteur: saved.employeNom || 'Salarié',
      details: `Demande de ${saved.typeConge} pour la période du ${saved.dateDebut} au ${saved.dateFin}`,
      type: 'creation',
    }).catch(() => {});

    return res.status(201).json(saved);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
};

exports.getConge = async (req, res, next) => {
  try {
    const conges = await Conge.find().sort({ createdAt: -1 });

    // Auto-resolve missing employee names from Employe collection
    const employeIdsToLookup = [...new Set(conges.filter((c) => !c.employeNom).map((c) => c.employeId))];
    const employes = await Employe.find({ _id: { $in: employeIdsToLookup } });
    const empMap = new Map(employes.map((e) => [String(e._id), `${e.prenom} ${e.nom}`]));

    const populated = conges.map((c) => {
      const obj = c.toObject();
      if (!obj.employeNom && obj.employeId) {
        obj.employeNom = empMap.get(String(obj.employeId)) || 'Collaborateur';
      }
      return obj;
    });

    return res.status(200).json(populated);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
};

exports.editConge = async (req, res, next) => {
  try {
    const result = await Conge.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (req.body.statut) {
      await AuditLog.create({
        action: `Congé ${req.body.statut === 'approuve' ? 'approuvé' : req.body.statut === 'refuse' ? 'refusé' : 'modifié'}`,
        auteur: 'Validateur RH',
        details: `Décision sur la demande de congé de ${result.employeNom || 'Salarié'} : ${req.body.statut}`,
        type: 'validation',
      }).catch(() => {});
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
};

exports.deleteConge = async (req, res, next) => {
  try {
    const result = await Conge.deleteOne({ _id: req.params.id });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
};