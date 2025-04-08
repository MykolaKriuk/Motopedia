import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateUser.css';

export default function UpdateUser() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ login: '', email: '' });
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const fetchUser = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				setError('Authorization token is missing. Please log in.');
				return;
			}
			const res = await axios.get(`/users/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			setFormData({login: res.data.Login, email: res.data.Email});
		} catch (err) {
				console.error('Error fetching user:', err.response?.data || err.message);
				setError(err.response?.data?.message || 'Failed to fetch user details.');
		}

		};
	useEffect(() => {
		fetchUser();
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
			await axios.put(`/users/${id}`, formData);
			setSuccess('User updated successfully!');
			setTimeout(() => navigate('/users'), 2000);
		} catch (err) {
			console.error('Error updating user:', err);
			setError('Failed to update user. Please try again.');
		}
	};

	if (error) {
		return <div className="error-message">{error}</div>;
	}

	return (
		<div className="update-user-container">
			<h2>Update User</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Login</label>
					<input
						type="text"
						name="login"
						value={formData.login}
						onChange={handleInputChange}
					/>
				</div>
				<div className="form-group">
					<label>Email</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
					/>
				</div>
				{error && <p className="error">{error}</p>}
				{success && <p className="success">{success}</p>}
				<button type="submit">Update User</button>
			</form>
		</div>
	);
}
