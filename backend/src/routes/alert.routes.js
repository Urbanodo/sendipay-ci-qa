const express = require('express');
const { getAlerts, createAlert, deleteAlert } = require('../controllers/alert.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/',       getAlerts);
router.post('/',      createAlert);
router.delete('/:id', deleteAlert);

module.exports = router;
