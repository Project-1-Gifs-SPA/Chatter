import React, { useContext, useEffect, useState } from 'react'
import TeamIcon from '../TeamIcon/TeamIcon';
import DMIcon from '../DMIcon/DMIcon';
import AddTeam from '../AddTeam/AddTeam';
import { logoutUser } from '../../services/auth.service';
import AppContext from '../../context/AppContext';
import { useNavigate, useParams } from 'react-router';

const SideBar = () => {
	const { user, userData, setContext } = useContext(AppContext);
	const navigate = useNavigate();

	const [teams, setTeams] = useState([]);
	

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


	useEffect(()=>{
		console.log('getting teams')
		if(userData.teams){
			const teamsData = Object.keys(userData.teams);
			setTeams([...teams,...teamsData])
			
		}
		if(userData.myTeams){
			const myTeamsData = Object.keys(userData.myTeams);
			setTeams([...teams,...myTeamsData])
		}

		
		
},[userData.myTeams,userData.teams])


	return (
		<>
			<div className="flex flex-col justify-between h-screen bg-gray-900">
				<div className="bg-gray-900 text-purple-lighter flex-none w-24 p-6 hidden md:block">
					{/* Your existing content */}
					<DMIcon />
					{teams.length?
					teams.map(teamId=>{
						return <TeamIcon key={teamId} id={teamId} />
					
					}) : null	
					}
					{/* <TeamIcon />
					<TeamIcon />
					<TeamIcon /> */}
					<AddTeam />
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