const express = require('express');

const router = express.Router();

const employeCtrl = require('../controllers/Employe');

router.post('/',employeCtrl.createEmploye)
// TODO: app.get('/api/employes', ...)

router.get('/', employeCtrl.getEmploye);


// TODO: app.put('/api/employes/:id', ...)

 router.put('/:id', employeCtrl.editEmploye);

// TODO: app.delete('/api/employes/:id', ...)
 
router.delete('/:id',employeCtrl.deleteEmploye);

module.exports = router;