import React from 'react';
import {useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';

export default function Home() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<div className="home-container">
			<h2>{t('home.welcome')}</h2>
			<p>{t('home.description')}</p>
			<button
				className="home-button"
				onClick={() => navigate('/search-motorcycles')}
			>
				{t('home.searchButton')}
			</button>
		</div>
	);
}