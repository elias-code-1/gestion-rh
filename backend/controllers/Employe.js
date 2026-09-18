const Employe = require('../models/Employe');

 exports.createEmploye =(req, res, next) => {
    const employes = new Employe ({
        ...req.body
    });
    employes.save()
    .then(employes => res.status(201).json(employes))
    .catch(error => res.status(400).json({error}));
}

exports.getEmploye =(req, res, next) => {
   Employe.find()
   .then(employes => res.status(200).json(employes))
   .catch(error => res.status(400).json({error})); 
}

exports.deleteEmploye =(req, res, next) => {
    Employe.deleteOne({ _id: req.params.id})
    .then(employes => res.status(200).json(employes))
    .catch(error => res.status(400).json({error}));
};

exports.editEmploye =(req, res, next) => {
    Employe.updateOne({ _id: req.params.id }, ({  ...req.body, _id: req.params.id }))
    .then(employes => res.status(200).json(employes))
    .catch(error => res.status(400).json({error}));
 }

