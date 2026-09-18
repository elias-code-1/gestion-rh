const Conge = require('../models/conge');


exports.createConge =(req, res, next) => {
    const conge = new Conge ({
        ...req.body
    });
    conge.save()
    .then(conge => res.status(201).json(conge))
    .catch(error => res.status(400).json({error}))
}

exports.getConge = (req, res, next) => {
    Conge.find()
    .then(conges => res.status(200).json(conges))
    .catch(error => res.status(400).json({error}));
}

exports.editConge = (req, res, next) => {
    Conge.updateOne({ _id: req.params.id }, ({  ...req.body, _id: req.params.id }))
    .then(conge => res.status(200).json(conge))
    .catch(error => res.status(400).json({error}));
 }

 exports.deleteConge =(req, res, next) => {
    Conge.deleteOne({ _id: req.params.id})
    .then(conge => res.status(200).json(conge))
    .catch(error => res.status(400).json({error}));
}