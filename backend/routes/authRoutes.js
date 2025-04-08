const express = require('express');
const authController = require('../controllers/authController.js');
const { validateRegistration } = require('../security/middlewares/validationMiddleware.js');
const { validationResult } = require('express-validator');

const router = express.Router();

router.post('/register', validateRegistration, (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	next();
}, authController.register);
router.post('/login', async (req, res) => {
	try {
		await authController.login(req, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error.' });
	}
});

module.exports = router;
