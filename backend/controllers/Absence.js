const Absence = require('../models/Absence');

exports.getAbsence = (req, res, next) => {
    Absence.find()
    .then(absences => res.status(200).json(absences))
    .catch(error => res.status(400).json({error}));
};

exports.createAbsence = (req, res, next) => {
    const absences = new Absence ({
        ...req.body
    });
    absences.save()
    .then(absences => res.status(201).json(absences))
    .catch(error => res.status(400).json({error}))
}
exports.editAbsence =  (req, res, next) => {
    Absence.updateOne({ _id: req.params.id }, ({  ...req.body, _id: req.params.id }))
    .then(absences => res.status(200).json(absences))
    .catch(error => res.status(400).json({error}));
 }

 exports.deleteAbsence =  (req, res, next) => {
    Absence.deleteOne({ _id: req.params.id})
    .then(absences => res.status(200).json(absences))
    .catch(error => res.status(400).json({error}));
}