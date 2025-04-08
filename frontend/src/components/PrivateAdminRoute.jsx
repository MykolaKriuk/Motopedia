import React from 'react';
import { jwtDecode as decode } from 'jwt-decode';
import './ViewAllUsers/ViewAllUsers.css';

function getRoleFromToken(token) {
	if (!token) return null;

	try {
		const decoded = decode(token);
		return decoded.role;
	} catch (err) {
		console.error('Failed to decode token:', err);
		return null;
	}
}

export default function PrivateAdminRoute({ children }) {
	const token = localStorage.getItem('token');
	return token && getRoleFromToken(token) === 'admin' ?
		children :
		<div className="error-message">You don't have permission.</div>;
};