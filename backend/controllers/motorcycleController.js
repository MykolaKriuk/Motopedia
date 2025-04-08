const database = require('../database/connection.js');

exports.createMotorcycle = (req, res) => {
	const {
		model,
		type,
		dateOfProduce,
		price,
		description,
		drivetrain,
		brandName,
		engineType,
		engineCapacity,
	} = req.body;

	if (!model || !type || !dateOfProduce || !price || !description || !drivetrain || !brandName) {
		return res.status(400).send({ message: 'All fields are required.' });
	}

	if (isNaN(price) || price <= 0) {
		return res.status(400).send({ message: 'Price must be a positive number.' });
	}

	if (isNaN(engineCapacity) || engineCapacity <= 0) {
		return res.status(400).send({ message: 'Engine capacity must be a positive number.' });
	}

	const getBrandQuery = 'SELECT Id FROM Brand WHERE Name = ?';
	database.query(getBrandQuery, [brandName], (err, brandResults) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}

		if (brandResults.length === 0) {
			return res.status(400).send({ message: 'Brand not found.' });
		}

		const brandId = brandResults[0].Id;

		const insertQuery = `
            INSERT INTO Motorcycle (Model, Type, Date_Of_Produce, Price, Description, Drivetrain, Brand_Id, Engine_Type, Engine_Capacity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
		database.query(
			insertQuery,
			[model, type, dateOfProduce, price, description, drivetrain, brandId, engineType, engineCapacity],
			(err, results) => {
				if (err) {
					console.error(err);
					return res.status(500).send(err);
				}
				res.status(201).send({ message: 'Motorcycle created', id: results.insertId });
			}
		);
	});
};

exports.getAllMotorcyclesWithNameAndBrand = (req, res) => {
	const query = `
        SELECT m.Model, b.Name AS Brand_Name
        FROM Motorcycle m
        LEFT JOIN Brand b ON m.Brand_Id = b.Id
        ORDER BY m.Model ASC
    `;
	database.query(query, (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		res.status(200).send(results);
	});
};

exports.getMotorcyclesWithNameAndBrandByModel = (req, res) => {
	const { name } = req.query;
	const baseQuery = `
        SELECT m.Id, m.Model, b.Name AS Brand_Name
        FROM Motorcycle m
        LEFT JOIN Brand b ON m.Brand_Id = b.Id
    `;
	const queryParams = [];

	let query = baseQuery;
	if (name) {
		query += ' WHERE m.Model LIKE ?';
		queryParams.push(`%${name}%`);
	}

	query += ' ORDER BY m.Model ASC';

	database.query(query, queryParams, (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		res.status(200).send(results);
	});
};



exports.getMotorcycleById = (req, res) => {
	const { id } = req.params;
	const query = `
        SELECT m.*, b.Name AS Brand_Name, b.Country AS Brand_Country
        FROM Motorcycle m
        LEFT JOIN Brand b ON m.Brand_Id = b.Id
        WHERE m.Id = ?
    `;
	database.query(query, [id], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		if (results.length === 0) {
			return res.status(404).send({ message: 'Motorcycle not found' });
		}
		res.status(200).send(results[0]);
	});
};

exports.getEditorsByMotorcycleId = (req, res) => {
	const { id } = req.params;

	const query = `
        SELECT 
            u.Login,
            u.Email,
            me.Comment,
            me.Amount_Of_Changes,
            me.Date_Of_Editing
        FROM Motorcycle_Editing me
        INNER JOIN User u ON me.User_Id = u.Id
        WHERE me.Motorcycle_Id = ?
    `;

	database.query(query, [id], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).send({ message: 'Failed to retrieve editors.', error: err });
		}

		if (results.length === 0) {
			return res.status(404).send({ message: 'No editors found for this motorcycle.' });
		}

		res.status(200).send(results);
	});
};


exports.updateMotorcycle = (req, res) => {
	const { id } = req.params;
	const {
		type,
		dateOfProduce,
		price,
		description,
		drivetrain,
		brandName,
		engineType,
		engineCapacity,
		comment,
		userId,
	} = req.body;

	if (!userId || !comment) {
		return res.status(400).send({ message: 'User ID and comment are required' });
	}
	if (!type || !dateOfProduce || !price || !description || !drivetrain || !brandName) {
		return res.status(400).send({ message: 'All fields are required.' });
	}

	if (isNaN(price) || price <= 0) {
		return res.status(400).send({ message: 'Price must be a positive number.' });
	}

	if (isNaN(engineCapacity) || engineCapacity <= 0) {
		return res.status(400).send({ message: 'Engine capacity must be a positive number.' });
	}

	const getMotorcycleQuery = `
        SELECT Type, Date_Of_Produce, Price, Description, Drivetrain, Brand_Id, Engine_Type, Engine_Capacity
        FROM Motorcycle
        WHERE Id = ?
    `;

	const getBrandIdQuery = `SELECT Id FROM Brand WHERE Name = ?`;

	const updatingQuery = `
        UPDATE Motorcycle
        SET Type = ?, Date_Of_Produce = ?, Price = ?, Description = ?, Drivetrain = ?, Brand_Id = ?, Engine_Type = ?, Engine_Capacity = ?
        WHERE Id = ?
    `;

	const insertingQuery = `
        INSERT INTO Motorcycle_Editing (Motorcycle_Id, User_Id, Date_Of_Editing, Comment, Amount_Of_Changes)
        VALUES (?, ?, NOW(), ?, ?)
    `;

	database.query(getBrandIdQuery, [brandName], (err, brandResults) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}

		if (brandResults.length === 0) {
			return res.status(400).send({ message: 'Brand not found' });
		}

		const brandId = brandResults[0].Id;

		database.query(getMotorcycleQuery, [id], (err, results) => {
			if (err) {
				console.error(err);
				return res.status(500).send(err);
			}

			if (results.length === 0) {
				return res.status(404).send({ message: 'Motorcycle not found' });
			}

			const currentData = results[0];

			const numberOfChanges = [
				type !== currentData.Type,
				dateOfProduce !== currentData.Date_Of_Produce,
				price !== currentData.Price,
				description !== currentData.Description,
				drivetrain !== currentData.Drivetrain,
				brandId !== currentData.Brand_Id,
				engineType !== currentData.Engine_Type,
				engineCapacity !== currentData.Engine_Capacity,
			].filter(Boolean).length - 1;

			database.query(
				updatingQuery,
				[
					type,
					dateOfProduce,
					price,
					description,
					drivetrain,
					brandId,
					engineType,
					engineCapacity,
					id,
				],
				(err, updatingResults) => {
					if (err) {
						console.error(err);
						return res.status(500).send(err);
					}

					if (updatingResults.affectedRows === 0) {
						return res.status(404).send({ message: 'Motorcycle not found' });
					}

					database.query(
						insertingQuery,
						[id, userId, comment, numberOfChanges],
						(err) => {
							if (err) {
								console.error(err);
								return res.status(500).send(err);
							}

							res.status(201).send({
								message: 'Motorcycle updated and editing record added'
							});
						}
					);
				}
			);
		});
	});
};


exports.deleteMotorcycle = (req, res) => {
	const { id } = req.params;
	const query = `
		DELETE 
		FROM Motorcycle 
		WHERE Id = ?
	`;
	database.query(query, [id], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		if (results.affectedRows === 0) {
			return res.status(404).send({ message: 'Motorcycle not found' });
		}
		res.send({ message: 'Motorcycle deleted' });
	});
};