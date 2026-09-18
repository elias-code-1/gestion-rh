const express = require('express');

const router = express.Router();

const congeCtrl = require('../controllers/conge');


router.get('/', congeCtrl.createConge);
// TODO: app.post('/api/conges', ...)

router.post('/', congeCtrl.getConge);
// TODO: app.put('/api/conges/:id', ...)
router.put('/:id', congeCtrl.editConge);
// TODO: app.delete('/api/conges/:id', ...)
router.delete('/:id', congeCtrl.deleteConge);


module.exports = router;