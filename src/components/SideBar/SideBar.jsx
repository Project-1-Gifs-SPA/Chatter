import React, { useContext } from 'react'
import TeamIcon from '../TeamIcon/TeamIcon';
import DMIcon from '../DMIcon/DMIcon';
import AddTeam from '../AddTeam/AddTeam';
import { logoutUser } from '../../services/auth.service';
import AppContext from '../../context/AppContext';
import { useNavigate, useParams } from 'react-router';

const SideBar = () => {
	const { user, userData, setContext } = useContext(AppContext);
	const navigate = useNavigate();

	return (
		<>
			<div className="flex flex-col justify-between h-screen bg-gray-900">
				<div className="bg-gray-900 text-purple-lighter flex-none w-24 p-6 hidden md:block">
					{/* Your existing content */}
					<DMIcon />
					<TeamIcon />
					<TeamIcon />
					<TeamIcon />
					<AddTeam />
				</div>
			</div>
			{/* </div > */}
		</>
	)
}

export default SideBar