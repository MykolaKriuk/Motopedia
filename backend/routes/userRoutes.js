const express = require('express');
const { protect } = require('../security/middlewares/authMiddleware.js');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/', protect, userController.getAllUsers);
router.get('/:id', protect, userController.getUserWithEditedMotorcycles);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, userController.deleteUser);

module.exports = router;