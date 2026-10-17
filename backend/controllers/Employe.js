const Employe = require('../models/Employe');

exports.createEmploye = (req, res, next) => {
  const employes = new Employe({
    ...req.body
  });

  employes.save()
    .then((employe) => res.status(201).json(employe))
    .catch((error) => res.status(400).json({ error }));
};

exports.getEmploye = (req, res, next) => {
  Employe.find()
    .then((employes) => res.status(200).json(employes))
    .catch((error) => res.status(400).json({ error }));
};

exports.getEmployeById = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID employé requis.' });
  }

  Employe.findOne({ _id: id })
    .then((employe) => {
      if (!employe) {
        return res.status(404).json({ message: 'Employé introuvable.' });
      }
      return res.status(200).json(employe);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'ID employé invalide.' });
      }
      return res.status(500).json({ error: error.message || error });
    });
};

exports.deleteEmploye = (req, res, next) => {
  Employe.deleteOne({ _id: req.params.id })
    .then((employes) => res.status(200).json(employes))
    .catch((error) => res.status(400).json({ error }));
};

exports.editEmploye = (req, res, next) => {
  Employe.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then((employes) => res.status(200).json(employes))
    .catch((error) => res.status(400).json({ error }));
};

