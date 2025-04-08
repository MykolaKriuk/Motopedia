const database = require('../database/connection.js');

exports.getAllUsers = (req, res) => {
	const query = 'SELECT Id, Login, Email FROM User';
	database.query(query, (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		res.status(200).send(results);
	});
};

exports.getUserWithEditedMotorcycles = (req, res) => {
	const { id } = req.params;

	const query = `
        SELECT 
            u.Id,
            u.Login,
            u.Email,
            me.Motorcycle_Id,
            m.Model,
            me.Comment,
            me.Date_Of_Editing,
            me.Amount_Of_Changes
        FROM User u
        LEFT JOIN Motorcycle_Editing me ON u.Id = me.User_Id
        LEFT JOIN Motorcycle m ON me.Motorcycle_Id = m.Id
        WHERE u.Id = ?
    `;

	database.query(query, [id], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}

		if (results.length === 0) {
			return res.status(404).send({ message: 'User not found or no edits available.' });
		}

		const user = {
			Id: results[0].Id,
			Login: results[0].Login,
			Email: results[0].Email,
			Edits: results
				.filter(row => row.Motorcycle_Id)
				.map(row => ({
					Motorcycle_Id: row.Motorcycle_Id,
					Model: row.Model,
					Comment: row.Comment,
					Date_Of_Editing: row.Date_Of_Editing,
					Amount_Of_Changes: row.Amount_Of_Changes
				})),
		};

		res.status(200).send(user);
	});
};


exports.updateUser = (req, res) => {
	const { id } = req.params;
	const { login, email } = req.body;

	if (!login && !email) {
		return res.status(400).send({ message: 'Login or email is required for update.' });
	}
	if(!email.isEmail()) {
		return res.status(400).send({ message: 'Invalid email format.' });
	}


	const query = `
        UPDATE User 
        SET Login = ?, Email = ?
        WHERE Id = ?
    `;
	database.query(query, [login, email, id], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		if (results.affectedRows === 0) {
			return res.status(404).send({ message: 'User not found' });
		}
		res.status(200).send({ message: 'User updated' });
	});
};

exports.deleteUser = (req, res) => {
	const { id } = req.params;

	const query = 'DELETE FROM User WHERE Id = ?';
	database.query(query, [id], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		if (results.affectedRows === 0) {
			return res.status(404).send({ message: 'User not found' });
		}
		res.status(200).send({ message: 'User deleted' });
	});
};