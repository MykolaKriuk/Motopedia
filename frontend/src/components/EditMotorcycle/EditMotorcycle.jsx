import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode as decode} from 'jwt-decode';
import './EditMotorcycle.css';

export default function EditMotorcycle() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		type: '',
		dateOfProduce: '',
		price: '',
		description: '',
		drivetrain: '',
		brandName: '',
		engineType: '',
		engineCapacity: '',
		comment: '',
		userId: '',
	});
	const [brands, setBrands] = useState([]);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const fetchMotorcycle = async () => {
		try {
			const res = await axios.get(`/motorcycles/${id}`);
			const { Type, Date_Of_Produce, Price, Description, Drivetrain, Brand_Name, Engine_Type, Engine_Capacity } = res.data;
			const formattedDate = new Date(Date_Of_Produce).toISOString().split('T')[0];

			setFormData({
				type: Type,
				dateOfProduce: formattedDate,
				price: Price,
				description: Description,
				drivetrain: Drivetrain,
				brandName: Brand_Name,
				engineType: Engine_Type,
				engineCapacity: Engine_Capacity,
				comment: '',
				userId: '',
			});
		} catch (err) {
			console.error('Error fetching motorcycle details:', err);
			setError('Failed to fetch motorcycle details.');
		}
	};
	const fetchBrands = async () => {
		try {
			const res = await axios.get('/brands');
			setBrands(res.data);
		} catch (err) {
			console.error('Error fetching brands:', err);
		}
	};

	useEffect(() => {
		fetchMotorcycle();
		fetchBrands();
	}, [id]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		try {
			const token = localStorage.getItem('token');
			formData.userId = decode(token).userId;
			await axios.put(`/motorcycles/${id}`, formData, {
				headers: {
					Authorization: `Bearer: ${token}`
				}
			});
			setSuccess('Motorcycle updated successfully!');
			setTimeout(() => navigate(`/motorcycles/${id}`), 2000);
		} catch (err) {
			console.error('Error updating motorcycle:', err);
			setError('Failed to update motorcycle. Please try again.');
		}
	};

	if (error) {
		return <div className="error-message">{error}</div>;
	}

	return (
		<div className="edit-motorcycle-container">
			<h2>Edit Motorcycle</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Type</label>
					<input
						type="text"
						name="type"
						value={formData.type}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>Date of Production</label>
					<input
						type="date"
						name="dateOfProduce"
						value={formData.dateOfProduce}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>Price</label>
					<input
						type="number"
						name="price"
						value={formData.price}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>Description</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleInputChange}
					></textarea>
				</div>
				<div className="form-group">
					<label>Drivetrain</label>
					<input
						type="text"
						name="drivetrain"
						value={formData.drivetrain}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>Brand</label>
					<select
						name="brandName"
						value={formData.brandName}
						onChange={handleInputChange}
					>
						<option value="">Select Brand</option>
						{brands.map((brand, index) => (
							<option key={index} value={brand.Id}>
								{brand.Name}
							</option>
						))}
					</select>
				</div>
				<div className="form-group">
					<label>Engine Type</label>
					<input
						type="text"
						name="engineType"
						value={formData.engineType}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>Engine Capacity</label>
					<input
						type="number"
						name="engineCapacity"
						value={formData.engineCapacity}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>Comment</label>
					<textarea
						name="comment"
						value={formData.comment}
						onChange={handleInputChange}
					></textarea>
				</div>
				{error && <p className="error">{error}</p>}
				{success && <p className="success">{success}</p>}
				<button type="submit">Update Motorcycle</button>
			</form>
		</div>
	);
}
