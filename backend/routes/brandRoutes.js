const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController.js');

router.get('/', brandController.getAllBrandsWithName);

//+++
router.get('/:id', brandController.getBrandById);

module.exports = router;