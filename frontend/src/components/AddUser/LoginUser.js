import React, { useState } from 'react';
import axios from 'axios';
import './AddUser.css';

export default function LoginUser() {
	const [formData, setFormData] = useState({
		login: '',
		password: ''
	});

	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleInputChange = (e) => {
		const {name, value} = e.target;
		setFormData({...formData, [name]: value});
		console.log('Form Data:', { ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		try {
			const res = await axios.post('/auth/login', formData);

			setSuccess('Login successful!');
			localStorage.setItem('token', res.data.token);
		} catch (err) {
			console.error('Error logging in:', err);
			setError(err.response?.data?.message || 'Failed to log in. Please try again.');
		}
	};

	return (
		<div className="add-user-container">
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Login</label>
					<input
						type="text"
						name="login"
						value={formData.login}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div className="form-group">
					<label>Password</label>
					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={handleInputChange}
						required
					/>
				</div>
				{error && <p className="error">{error}</p>}
				{success && <p className="success">{success}</p>}
				<button type="submit">Login</button>
			</form>
		</div>
	);
}
