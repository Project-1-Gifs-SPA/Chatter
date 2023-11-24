import React, { useContext, useEffect, useState } from 'react'
import TeamIcon from '../TeamIcon/TeamIcon';
import DMIcon from '../DMIcon/DMIcon';
import AddTeam from '../AddTeam/AddTeam';
import { logoutUser } from '../../services/auth.service';
import AppContext from '../../context/AppContext';
import { useNavigate, useParams } from 'react-router';
import { getLiveAllTeams } from '../../services/teams.service';
import { getLiveUserInfo, getUserByHandle } from '../../services/users.service';
import FriendsRequests from '../FriendsRequests/FriendsRequests';

const SideBar = () => {
	const { user, userData, setContext } = useContext(AppContext);
	const [showModal, setShowModal] = useState(false);
	const [teams, setTeams] = useState([]);
	const [allTeams, setAllTeams] = useState([]);
	const [currentUser, setCurrentUser] = useState({});
	const [requests, setRequests] = useState([]);

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
	}, [userData])

	console.log(currentUser)

	useEffect(() => {
		console.log('getting teams')
		const teamArr = [];
		if (currentUser.teams) {
			// const teamsData = Object.keys(currentUser.teams);
			// for (let id of Object.keys(currentUser.teams)) {
			// 	teamArr.push(id)
			// }
			(Object.keys(currentUser.teams)).forEach(id=>teamArr.push(id));
		}

		if (currentUser.myTeams) {
			// const myTeamsData = Object.keys(currentUser.myTeams);
			// setTeams([...myTeamsData])
			// for (let id of Object.keys(currentUser.myTeams)) {
			// 	teamArr.push(id)
			// }

			(Object.keys(currentUser.myTeams)).forEach(id=>teamArr.push(id));
		}
		setTeams(teamArr);
	}, [allTeams, currentUser])

	useEffect(() => {
		if (currentUser.friendRequests) {
			const promises = Object.keys(currentUser.friendRequests).map(request => {
				return getUserByHandle(request)
					.then((snapshot) => {
						return snapshot.val();
					});
			});

			Promise.all(promises)
				.then((membersData) => {
					setRequests(membersData);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [currentUser.friendRequests])

	console.log(requests)


	return (
		<>
			<div className="flex flex-col md:flex-col justify-between h-screen bg-gray-900">
				<div className="bg-gray-900 text-purple-lighter flex-none w-24 p-6 md:block">
					{/* Your existing content */}
					<DMIcon />
					{teams.length ?
						teams.map(teamId => {
							return <TeamIcon key={teamId} id={teamId} />
						}) : null
					}
					<AddTeam />
				</div>
				<button onClick={() => setShowModal(true)}
					className="btn mb-2 bg-gray-800 border-none text-white text-sm"
					style={{ width: '80px', height: '70px', padding: '4px 8px' }}
				>
					<div className="badge badge-secondary badge-xs">
						{currentUser.friendRequests ? `+${Object.keys(currentUser.friendRequests).length}` : 0}
					</div>
					Friends requests
				</button>
			</div >
			{showModal && <FriendsRequests friendsRequests={currentUser.friendRequests} onClose={() => setShowModal(false)} />}
			{/* </div > */}
		</>
	)
}

export default SideBar;
