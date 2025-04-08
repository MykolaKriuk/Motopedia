const database = require('../database/connection.js');

exports.getAllBrandsWithName = (req, res) => {
	const query = 'SELECT Name FROM Brand';
	database.query(query, (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		res.status(200).send(results);
	});
};

exports.getBrandById = (req, res) => {
	const { id } = req.params;
	const query = 'SELECT * FROM Brand WHERE Id = ?';
	database.query(query, [id], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		if (results.length === 0) {
			return res.status(404).send({ message: 'Brand not found' });
		}
		res.status(200).send(results[0]);
	});
};
