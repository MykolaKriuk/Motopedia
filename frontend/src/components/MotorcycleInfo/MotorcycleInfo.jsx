import React, { useState, useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import './MotorcycleInfo.css';

export default function MotorcycleInfo() {
	const { id } = useParams();
	const [motorcycle, setMotorcycle] = useState(null);
	const [error, setError] = useState('');

	const fetchMotorcycle = async () => {
		try {
			const res = await axios.get(`/motorcycles/${id}`);
			setMotorcycle(res.data);
		} catch (err) {
			console.error('Error fetching motorcycle details:', err);
			setError('Failed to fetch motorcycle details.');
		}
	};
	useEffect(() => {
		fetchMotorcycle();
	}, [id]);

	if (error) {
		return <div className="error-message">{error}</div>;
	}

	if (!motorcycle) {
		return <div className="loading-message">Loading motorcycle details...</div>;
	}

	return (
		<div className="motorcycle-info-container">
			<h2>{motorcycle.Model}</h2>
			<p><strong>Type:</strong> {motorcycle.Type}</p>
			<p><strong>Date of Production:</strong> {new Date(motorcycle.Date_Of_Produce).toLocaleDateString()}</p>
			<p><strong>Price:</strong> ${motorcycle.Price}</p>
			<p><strong>Description:</strong> {motorcycle.Description}</p>
			<p><strong>Drivetrain:</strong> {motorcycle.Drivetrain}</p>
			<p><strong>Engine Type:</strong> {motorcycle.Engine_Type}</p>
			<p><strong>Engine Capacity:</strong> {motorcycle.Engine_Capacity}cc</p>
			<p><strong>Brand:</strong> {motorcycle.Brand_Name}</p>
			<p><strong>Country:</strong> {motorcycle.Brand_Country}</p>

			<Link to={`/motorcycles/${id}/update`} className="edit-button">
				Edit Motorcycle
			</Link>
			<Link to={`/motorcycles/${id}/editors`} className="editors-button">
				View Editors
			</Link>
		</div>
	);
}
