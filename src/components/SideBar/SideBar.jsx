import React, { useContext } from 'react'
import TeamIcon from '../TeamIcon/TeamIcon';
import DMIcon from '../DMIcon/DMIcon';
import AddTeams from '../AddTeams/AddTeams';
import { logoutUser } from '../../services/auth.service';
import AppContext from '../../context/AppContext';
import { useNavigate } from 'react-router';

const SideBar = () => {
	const { user, userData, setContext } = useContext(AppContext);
	const navigate = useNavigate();

	const onLogout = () => {
		logoutUser()
			.then(() => {
				setContext({
					user: null,
					userData: null,
				});
				navigate('/welcome')
			});
	};
	return (
		<>
			<div className="flex flex-col justify-between h-screen bg-gray-900">
				<div className="bg-gray-900 text-purple-lighter flex-none w-24 p-6 hidden md:block">
					{/* Your existing content */}
					<DMIcon />
					<TeamIcon />
					<TeamIcon />
					<TeamIcon />
				</div>

				<div className="bg-gray-900 text-purple-lighter flex-none w-24 p-6 hidden md:block">
					{/* Button at the bottom */}
					<button className="text-white px-4 py-2 rounded btn bg-purple-600 transition-colors hover:bg-purple-400 border-none" onClick={onLogout}>
						Sign out
					</button>
				</div>
			</div>
		</>
	)
}

export default SideBar