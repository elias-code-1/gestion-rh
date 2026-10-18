const express = require('express');
const router = express.Router();
const congeCtrl = require('../controllers/conge');

router.get('/', congeCtrl.getConge);
router.post('/', congeCtrl.createConge);
router.put('/:id', congeCtrl.editConge);
router.delete('/:id', congeCtrl.deleteConge);

module.exports = router;