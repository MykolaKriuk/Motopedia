import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewAllUsers.css';

export default function ViewAllUsers() {
	const [users, setUsers] = useState([]);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const fetchUsers = async () => {

		try {
			const token = localStorage.getItem('token');
			const res = await axios.get('/users', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			setUsers(res.data);
		} catch (err) {
			console.error('Error fetching users:', err);
			setError('Failed to fetch users.');
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const deleteUser = async (id) => {
		if (!window.confirm('Are you sure you want to delete this user?')) return;

		try {
			await axios.delete(`/users/${id}`);
			setUsers(users.filter(user => user.Id !== id));
		} catch (err) {
			console.error('Error deleting user:', err);
			alert('Failed to delete user.');
		}
	};

	if (error) {
		return <div className="error-message">{error}</div>;
	}

	return (
		<div className="view-all-users-container">
			<h2>All Users</h2>
			<ul className="user-list">
				{users.map(user => (
					<li key={user.Id} className="user-item">
						<div className="user-info">
							<span className="user-login">{user.Login}</span>
							<span className="user-email">{user.Email}</span>
						</div>
						<div className="user-actions">
							<button onClick={() => navigate(`/users/${user.Id}/info`)} className="iu-button">Info</button>
							<button onClick={() => navigate(`/users/${user.Id}/update`)} className="iu-button">Update</button>
							<button onClick={() => deleteUser(user.Id)} className="delete-button">Delete</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
