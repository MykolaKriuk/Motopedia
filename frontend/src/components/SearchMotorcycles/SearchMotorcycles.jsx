import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SearchMotorcycles.css';

export default function SearchMotorcycles() {
	const [search, setSearch] = useState('');
	const [results, setResults] = useState([]);

	const fetchMotorcycles = async (name='') => {
		try {
			const res = await axios.get('/motorcycles/search',{
				params: {name}
			});
			setResults(res.data);
		} catch (error) {
			console.error('Error fetching motorcycles:', error);
		}
	}

	useEffect(() => {
		fetchMotorcycles();
	}, []);

	function handleSearchChange(event) {
		const value = event.target.value;
		setSearch(value);
		if (value.trim() === '') {
			fetchMotorcycles();
		} else {
			fetchMotorcycles(value);
		}
	}

	return (
		<div className="search-container">
			<h2>Search for Motorcycles</h2>

			<input
				type="text"
				placeholder="Enter motorcycle model..."
				value={search}
				onChange={handleSearchChange}
				className="search-input"
			/>

			<ul className="results-list">
				{results.map((moto, index) => (
					<li key={index}>
						<Link to={`/motorcycles/${moto.Id}`} className="result-link">
							{moto.Model} - {moto.Brand_Name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}