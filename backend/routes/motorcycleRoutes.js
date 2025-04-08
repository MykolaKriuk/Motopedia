const { protect } = require('../security/middlewares/authMiddleware.js');
const express = require('express');
const router = express.Router();
const motorcycleController = require('../controllers/motorcycleController.js');

router.post('/', protect, motorcycleController.createMotorcycle);
router.get('/', motorcycleController.getAllMotorcyclesWithNameAndBrand);
router.get('/search', motorcycleController.getMotorcyclesWithNameAndBrandByModel);
router.get('/:id', motorcycleController.getMotorcycleById);
router.get('/:id/editors', protect, motorcycleController.getEditorsByMotorcycleId);
router.put('/:id', protect, motorcycleController.updateMotorcycle);
router.delete('/:id', protect, motorcycleController.deleteMotorcycle);

module.exports = router;
