const express = require('express');

const router = express.Router();

const employeCtrl = require('../controllers/Employe');

router.post('/', employeCtrl.createEmploye);
router.get('/', employeCtrl.getEmploye);
router.get('/:id', employeCtrl.getEmployeById);
router.put('/:id', employeCtrl.editEmploye);
router.delete('/:id', employeCtrl.deleteEmploye);

module.exports = router;