import React, { useState } from 'react';
import axios from 'axios';
import './AddUser.css';

export default function AddUser() {
	const [formData, setFormData] = useState({
		login: '',
		email: '',
		password: ''
	});

	const [errors, setErrors] = useState({});
	const [success, setSuccess] = useState('');

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});
		setSuccess('');

		const validationErrors = {};
		if (!formData.login) validationErrors.login = 'Login is required.';
		if (!formData.email) validationErrors.email = 'Email is required.';
		if(formData.password.length <= 6) validationErrors.password = 'Password should be at least 7 characters';
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		try {
			await axios.post('/auth/register', formData);
			setSuccess('User registered successfully!');
			setFormData({ login: '', email: '' , password: ''});
		} catch (err) {
			console.error('Error registering user:', err.response?.data || err.message || err);
			setErrors({ api: err.response?.data?.message || 'Failed to register user. Please try again.' });
		}

	};

	return (
		<div className="add-user-container">
			<h2>Register</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Login</label>
					<input
						type="text"
						name="login"
						value={formData.login}
						onChange={handleInputChange}
					/>
					{errors.login && <p className="error">{errors.login}</p>}
				</div>
				<div className="form-group">
					<label>Email</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
					/>
					{errors.email && <p className="error">{errors.email}</p>}
				</div>
				<div className="form-group">
					<label>Password</label>
					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={handleInputChange}
					/>
					{errors.password && <p className="error">{errors.password}</p>}
				</div>
				{errors.api && <p className="error">{errors.api}</p>}
				{success && <p className="success">{success}</p>}
				<button type="submit">Add User</button>
			</form>
		</div>
	);
}
