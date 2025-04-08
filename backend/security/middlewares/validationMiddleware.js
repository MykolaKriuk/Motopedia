const { check } = require('express-validator');

exports.validateRegistration = [
	check('login').notEmpty().withMessage('Login is required'),
	check('email').isEmail().withMessage('Valid email is required'),
	check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
