const express = require('express');
const { getComparison } = require('../controllers/comparator.controller');

const router = express.Router();

// Route publique — pas besoin d'être connecté pour comparer
router.get('/', getComparison);

module.exports = router;
