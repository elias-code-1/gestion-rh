const mongoose = require('mongoose');
const Absence = require('../models/Absence');
const Employe = require('../models/Employe');
const AuditLog = require('../models/AuditLog');

exports.getAbsence = async (req, res, next) => {
  try {
    const absences = await Absence.find().sort({ date: -1 });

    const employeIdsToLookup = [...new Set(absences.filter((a) => !a.employeNom).map((a) => a.employeId))];
    const employes = await Employe.find({ _id: { $in: employeIdsToLookup } });
    const empMap = new Map(employes.map((e) => [String(e._id), `${e.prenom} ${e.nom}`]));

    const populated = absences.map((a) => {
      const obj = a.toObject();
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

exports.createAbsence = async (req, res, next) => {
  try {
    let employeNom = req.body.employeNom;
    if (!employeNom && req.body.employeId) {
      const emp = await Employe.findById(req.body.employeId).catch(() => null);
      if (emp) employeNom = `${emp.prenom} ${emp.nom}`;
    }

    const absence = new Absence({
      ...req.body,
      employeNom: employeNom || req.body.employeNom,
    });
    const saved = await absence.save();

    await AuditLog.create({
      action: 'Signalement absence',
      auteur: saved.employeNom || 'Salarié',
      details: `Absence pour motif : ${saved.motif || 'Non précisé'} le ${saved.date}`,
      type: 'creation',
    }).catch(() => {});

    return res.status(201).json(saved);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
};

exports.editAbsence = async (req, res, next) => {
  try {
    const result = await Absence.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
};

exports.deleteAbsence = async (req, res, next) => {
  try {
    const result = await Absence.deleteOne({ _id: req.params.id });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
};