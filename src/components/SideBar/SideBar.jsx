import React, { useContext, useEffect, useState } from 'react'
import TeamIcon from '../TeamIcon/TeamIcon';
import DMIcon from '../DMIcon/DMIcon';
import AddTeam from '../AddTeam/AddTeam';
import { logoutUser } from '../../services/auth.service';
import AppContext from '../../context/AppContext';
import { useNavigate, useParams } from 'react-router';
import { getLiveAllTeams } from '../../services/teams.service';
import { getLiveUserInfo } from '../../services/users.service';

const SideBar = () => {
	const { user, userData, setContext } = useContext(AppContext);



	const [teams, setTeams] = useState([]);
	const [allTeams, setAllTeams] = useState([]);
	const [currentUser, setCurrentUser] = useState({})

	useEffect(() => {
		console.log('live teams')

		const u = getLiveUserInfo((data) => {
			setCurrentUser(data)
		}, userData?.handle)

		const unsubscribe = getLiveAllTeams((result) => {
			setAllTeams(result);
		})

		return () => {
			unsubscribe();
			u();
		}

	}, [userData?.handle])


	useEffect(() => {
		console.log('getting teams')
		const teamArr = [];
		if (currentUser.teams) {
			// const teamsData = Object.keys(currentUser.teams);
			for (let id of Object.keys(currentUser.teams)) {
				teamArr.push(id)
			}
		}

		if (currentUser.myTeams) {
			// const myTeamsData = Object.keys(currentUser.myTeams);
			// setTeams([...myTeamsData])
			for (let id of Object.keys(currentUser.myTeams)) {
				teamArr.push(id)
			}
		}
		setTeams(teamArr);
	}, [allTeams, currentUser])


	return (
		<>
			<div className="flex flex-col justify-between h-screen bg-gray-900">
				<div className="bg-gray-900 text-purple-lighter flex-none w-24 p-6 hidden md:block">
					{/* Your existing content */}
					<DMIcon />
					{teams.length ?
						teams.map(teamId => {
							return <TeamIcon key={teamId} id={teamId} />

						}) : null
					}
					{/* <TeamIcon />
					<TeamIcon />
					<TeamIcon /> */}
					<AddTeam />
				</div>
			</div>
			{/* </div > */}
		</>
	)
}

export default SideBar