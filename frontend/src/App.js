import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Home from "./components/Home/Home.jsx";
import SearchMotorcycles from "./components/SearchMotorcycles/SearchMotorcycles.jsx";
import AddMotorcycle from "./components/AddMotorcycle/AddMotorcycle";
import MotorcycleInfo from "./components/MotorcycleInfo/MotorcycleInfo";
import AddUser from "./components/AddUser/AddUser";
import ViewAllUsers from "./components/ViewAllUsers/ViewAllUsers";
import UserInfo from "./components/UserInfo/UserInfo";
import UpdateUser from "./components/UpdateUser/UpdateUser";
import EditMotorcycle from "./components/EditMotorcycle/EditMotorcycle";
import MotorcycleEditors from "./components/MotorcycleEditors/MotorcycleEditors";
import LoginUser from "./components/AddUser/LoginUser";
import PrivateRoute from "./components/PrivateRoute";
import PrivateAdminRoute from "./components/PrivateAdminRoute";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "./components/LanguageSwitcher";

function App() {
	const {t} = useTranslation();

	const handleLogout = () => {
		localStorage.removeItem('token');
	};

	return (
		<Router>
			<header className="mp-header">
				<h1 className="header-h1">MotoPedia</h1>
			</header>
			<div className="mp-container">
				<nav className="mp-nav">
					<button onClick={handleLogout} className="logout-button">
						{t('app.logout')}
					</button>
					<h3>{t('app.navigation')}</h3>
					<ul>
						<li>
							<Link to="/">{t('app.home')}</Link>
						</li>
						<li>
							<Link to="/search-motorcycles">{t('app.searchMotorcycles')}</Link>
						</li>
						<li>
							<Link to="/add-motorcycle">{t('app.addMotorcycle')}</Link>
						</li>
						<li>
							<Link to="/register-user">{t('app.register')}</Link>
						</li>
						<li>
							<Link to="/login-user">{t('app.login')}</Link>
						</li>
						<li>
							<Link to="/users">{t('app.viewAllUsers')}</Link>
						</li>
					</ul>
					<h3>{t('app.switchLanguage')}</h3>
					<LanguageSwitcher style="logout-button"/>
				</nav>

				<div className="mp-main">
					<Routes>
						<Route path="/" element={<Home/>}/>
						<Route path="/search-motorcycles" element={<SearchMotorcycles />} />
						<Route path="/add-motorcycle" element={<PrivateRoute> <AddMotorcycle /></PrivateRoute>} />
						<Route path="/motorcycles/:id" element={<MotorcycleInfo />} />
						<Route path="/register-user" element={<AddUser />} />
						<Route path="/login-user" element={<LoginUser />}/>
						<Route path="/users" element={<PrivateAdminRoute><ViewAllUsers /></PrivateAdminRoute>} />
						<Route path="/users/:id/info" element={<PrivateAdminRoute><UserInfo /></PrivateAdminRoute>}/>
						<Route path="/users/:id/update" element={<PrivateAdminRoute><UpdateUser /></PrivateAdminRoute>}/>
						<Route path="/motorcycles/:id/update" element={<PrivateRoute><EditMotorcycle /></PrivateRoute>}/>
						<Route path="/motorcycles/:id/editors" element={<PrivateRoute><MotorcycleEditors /></PrivateRoute>} />
					</Routes>
				</div>
			</div>
			<footer className="mp-footer">
				<p>&copy; 2024 MotoPedia.</p>
			</footer>
		</Router>
	);
}

export default App;
