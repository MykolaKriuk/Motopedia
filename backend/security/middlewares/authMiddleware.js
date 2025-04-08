const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'No token provided.' });
	}

	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (err) {
		res.status(401).json({ message: 'Invalid token.' });
	}
};

exports.adminProtect = (req, res, next) => {
	if (req.user.role !== 'admin') {
		return res.status(403).json({ message: 'Not authorized as admin.' });
	}
	next();
};

