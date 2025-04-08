import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './MotorcycleEditors.css';

export default function MotorcycleEditors() {
	const { id } = useParams();
	const [editors, setEditors] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	const fetchEditors = async () => {
		try {
			const token = localStorage.getItem('token');
			const res = await axios.get(`/motorcycles/${id}/editors`, {
				headers: {
					Authorization: `Bearer: ${token}`
				}
			});
			setEditors(res.data);
			setError('');
		} catch (err) {
			console.error('Error fetching editors:', err);
			setError('Failed to fetch editors. Please try again.');
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchEditors();
	}, [id]);

	if (loading) {
		return <div className="loading-message">Loading editors...</div>;
	}

	if (error) {
		return <div className="error-message">{error}</div>;
	}

	return (
		<div className="motorcycle-editors-container">
			<h2>Editors of Motorcycle</h2>
			{editors.length === 0 ? (
				<p>No edits have been made to this motorcycle.</p>
			) : (
				<ul className="editors-list">
					{editors.map((editor, index) => (
						<li key={index} className="editor-item">
							<p><strong>User:</strong> {editor.Login} ({editor.Email})</p>
							<p><strong>Comment:</strong> {editor.Comment}</p>
							<p><strong>Date of Editing:</strong> {editor.Date_Of_Editing}</p>
							<p><strong>Number of Changes:</strong> {editor.Amount_Of_Changes}</p>
						</li>
					))}
				</ul>
			)}
			<Link to={`/motorcycles/${id}`} className="back-button">Back to Motorcycle Info</Link>
		</div>
	);
}
