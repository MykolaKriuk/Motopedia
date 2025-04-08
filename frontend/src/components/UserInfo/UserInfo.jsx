import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserInfo.css';

export default function UserInfo() {
	const { id } = useParams();
	const [user, setUser] = useState(null);
	const [error, setError] = useState('');

	const fetchUserDetails = async () => {
		try {
			const token = localStorage.getItem('token');
			const res = await axios.get(`/users/${id}`, {
				headers: {
					Authorization: `Bearer: ${token}`
				}
			});
			setUser(res.data);
		} catch (err) {
			console.error('Error fetching user details:', err);
			setError('Failed to fetch user details.');
		}
	};
	useEffect(() => {
		fetchUserDetails();
	}, [id]);

	if (error) {
		return <div className="error-message">{error}</div>;
	}

	if (!user) {
		return <div className="loading-message">Loading user details...</div>;
	}

	return (
		<div className="user-info-container">
			<h2>{user.Login}'s Information</h2>
			<p><strong>Email:</strong> {user.Email}</p>

			<h3>Edited Motorcycles</h3>
			{user.Edits.length > 0 ? (
				<ul className="edits-list">
					{user.Edits.map((edit, index) => (
						<li key={index} className="edit-item">
							<p><strong>Model:</strong> {edit.Model}</p>
							<p><strong>Comment:</strong> {edit.Comment}</p>
							<p><strong>Date of Editing:</strong> {edit.Date_Of_Editing}</p>
							<p><strong>Changes:</strong> {edit.Amount_Of_Changes}</p>
						</li>
					))}
				</ul>
			) : (
				<p>This user has not edited any motorcycles.</p>
			)}
		</div>
	);
}
