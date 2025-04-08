require('dotenv').config({ path: './auth.env' });

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const database = require('../database/connection');

exports.register = (req, res) => {
	const { login, email, password } = req.body;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const userExistsQuery = 'SELECT * FROM User WHERE Email = ? OR Login = ?';
	database.query(userExistsQuery, [email, login], (err, users) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Server error.' });
		}

		if (users.length > 0) {
			return res.status(400).json({ message: 'User already exists.' });
		}

		bcrypt.hash(password, 5, (err, hashedPassword) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Error hashing password.' });
			}

			const insertUserQuery = 'INSERT INTO User (Login, Email, Password) VALUES (?, ?, ?)';
			database.query(insertUserQuery, [login, email, hashedPassword], (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ message: 'Server error.' });
				}

				res.status(201).json({ message: 'User registered successfully.' });
			});
		});
	});
};

exports.login = (req, res) => {
	const { login, password } = req.body;

	const userQuery = 'SELECT * FROM User WHERE Login = ?';
	database.query(userQuery, [login], (err, users) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Server error.' });
		}

		const user = users[0];
		if (!user) {
			return res.status(400).json({ message: 'Invalid login or password.' });
		}

		bcrypt.compare(password, user.Password, (err, isMatch) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Server error.' });
			}

			if (!isMatch) {
				return res.status(400).json({ message: 'Invalid login or password.' });
			}

			const token = jwt.sign(
				{ userId: user.Id, role: user.Role },
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			);

			res.status(200).json({ token });
		});
	});
};
