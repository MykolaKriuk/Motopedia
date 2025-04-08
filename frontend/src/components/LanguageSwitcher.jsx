import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher({style}) {
	const { i18n } = useTranslation();

	const changeLanguage = (lang) => {
		i18n.changeLanguage(lang);
	};

	return (
		<div>
			<button id={style} onClick={() => changeLanguage('en')}>English</button>
			<button id={style} onClick={() => changeLanguage('pl')}>Polski</button>
		</div>
	);
}
