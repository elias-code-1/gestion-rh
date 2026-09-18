const express = require('express');

const router = express.Router();

const absenceCtrl = require('../controllers/Absence');
router.get('/', absenceCtrl.getAbsence );
// TODO: app.post('/api/absences', ...)

router.post('/', absenceCtrl.createAbsence);
// TODO: app.put('/api/absences/:id', ...)
router.put('/:id', absenceCtrl.editAbsence);
// TODO: app.delete('/api/absences/:id', ...)
router.delete('/:id',absenceCtrl.deleteAbsence);

module.exports = router;