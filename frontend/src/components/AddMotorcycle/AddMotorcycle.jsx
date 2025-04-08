import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddMotorcycle.css';

export default function AddMotorcycle() {
	const [formData, setFormData] = useState({
		model: '',
		type: '',
		dateOfProduce: '',
		price: '',
		description: '',
		drivetrain: '',
		brandName: '',
		engineType: '',
		engineCapacity: '',
	});

	const [brands, setBrands] = useState([]);
	const [errors, setErrors] = useState({});
	const [success, setSuccess] = useState('');

	useEffect(() => {
		axios.get('/brands')
			.then((res) => setBrands(res.data))
			.catch((err) => console.error('Error fetching brands:', err));
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});
		setSuccess('');

		const validationErrors = {};
		if (!formData.model) validationErrors.model = 'Model is required.';
		if (!formData.type) validationErrors.type = 'Type is required.';
		if (!formData.dateOfProduce) validationErrors.dateOfProduce = 'Date of production is required.';
		if (!formData.price || isNaN(formData.price) || formData.price <= 0) validationErrors.price = 'Price must be a positive number.';
		if (!formData.description) validationErrors.description = 'Description is required.';
		if (!formData.drivetrain) validationErrors.drivetrain = 'Drivetrain is required.';
		if (!formData.brandName) validationErrors.brandName = 'Brand name is required.';
		if (!formData.engineType) validationErrors.engineType = 'Engine type is required.';
		if (!formData.engineCapacity || isNaN(formData.engineCapacity) || formData.engineCapacity <= 0) validationErrors.engineCapacity = 'Engine capacity must be a positive number.';

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		try {
			const token = localStorage.getItem('token');
			await axios.post('/motorcycles', formData, {
				headers: {
					Authorization: `Bearer: ${token}`
				}
			});
			setSuccess('Motorcycle added successfully!');
			setFormData({
				model: '',
				type: '',
				dateOfProduce: '',
				price: '',
				description: '',
				drivetrain: '',
				brandName: '',
				engineType: '',
				engineCapacity: '',
			});
		} catch (err) {
			console.error('Error creating motorcycle:', err);
			setErrors({ api: 'Failed to add motorcycle. Please try again.' });
		}
	};

	return (
		<div className="add-motorcycle-container">
			<h2>Add New Motorcycle</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Model</label>
					<input type="text" name="model" value={formData.model} onChange={handleInputChange} />
					{errors.model && <p className="error">{errors.model}</p>}
				</div>
				<div className="form-group">
					<label>Type</label>
					<input type="text" name="type" value={formData.type} onChange={handleInputChange} />
					{errors.type && <p className="error">{errors.type}</p>}
				</div>
				<div className="form-group">
					<label>Date of Production</label>
					<input type="date" name="dateOfProduce" value={formData.dateOfProduce} onChange={handleInputChange} />
					{errors.dateOfProduce && <p className="error">{errors.dateOfProduce}</p>}
				</div>
				<div className="form-group">
					<label>Price</label>
					<input type="number" name="price" value={formData.price} onChange={handleInputChange} />
					{errors.price && <p className="error">{errors.price}</p>}
				</div>
				<div className="form-group">
					<label>Description</label>
					<textarea name="description" value={formData.description} onChange={handleInputChange}></textarea>
					{errors.description && <p className="error">{errors.description}</p>}
				</div>
				<div className="form-group">
					<label>Drivetrain</label>
					<input type="text" name="drivetrain" value={formData.drivetrain} onChange={handleInputChange} />
					{errors.drivetrain && <p className="error">{errors.drivetrain}</p>}
				</div>
				<div className="form-group">
					<label>Brand</label>
					<select name="brandName" value={formData.brandName} onChange={handleInputChange}>
						<option value="">Select Brand</option>
						{brands.map((brand, index) => (
							<option key={index} value={brand.Name}>{brand.Name}</option>
						))}
					</select>
					{errors.brandName && <p className="error">{errors.brandName}</p>}
				</div>
				<div className="form-group">
					<label>Engine Type</label>
					<input type="text" name="engineType" value={formData.engineType} onChange={handleInputChange} />
					{errors.engineType && <p className="error">{errors.engineType}</p>}
				</div>
				<div className="form-group">
					<label>Engine Capacity</label>
					<input type="number" name="engineCapacity" value={formData.engineCapacity} onChange={handleInputChange} />
					{errors.engineCapacity && <p className="error">{errors.engineCapacity}</p>}
				</div>
				{errors.api && <p className="error">{errors.api}</p>}
				{success && <p className="success">{success}</p>}
				<button type="submit">Add Motorcycle</button>
			</form>
		</div>
	);
}
