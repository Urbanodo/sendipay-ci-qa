const express = require('express');
const { getTransfers, createTransfer, deleteTransfer } = require('../controllers/transfer.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect); // Toutes les routes transferts nécessitent une auth

router.get('/',        getTransfers);
router.post('/',       createTransfer);
router.delete('/:id',  deleteTransfer);

module.exports = router;
