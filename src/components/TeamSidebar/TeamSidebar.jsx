import { useContext, useEffect, useState } from 'react'
import { IoPeopleSharp } from "react-icons/io5";
import { IoPeopleOutline } from "react-icons/io5";
import { useParams } from 'react-router';
import { getLiveTeamInfo } from '../../services/teams.service';
import { getLiveUserInfo, getUserByHandle, removeFriends, sendFriendRequest } from '../../services/users.service';
import TeamMember from '../TeamMember/TeamMember';
import SearchBar from '../SearchBar/SearchBar';
import AppContext from '../../context/AppContext';
import { BsPersonFillAdd } from "react-icons/bs";
import { MdPersonAddDisabled } from "react-icons/md";

const TeamSidebar = () => {
	const { userData } = useContext(AppContext)
	const [expanded, setExpanded] = useState(true)
	const [currentTeam, setCurrentTeam] = useState({});
	const [members, setMembers] = useState([]);
	const { teamId } = useParams();
	const [currentUser, setCurrentUser] = useState({});

	useEffect(
		() => {
			const u1 = getLiveUserInfo(
				data => {
					setCurrentUser(data);
				},
				userData.handle);
			return () => {
				u1();
			};
		}, [userData]);

	useEffect(() => {
		const unsubscribe = getLiveTeamInfo(data => {
			setCurrentTeam({ ...data })
		}, teamId)
		return () => {
			unsubscribe();
		}
	}, [teamId])

	useEffect(() => {
		if (currentTeam.members) {
			const promises = Object.keys(currentTeam.members).map(member => {
				return getUserByHandle(member)
					.then((snapshot) => {
						return snapshot.val();
					});
			});

			Promise.all(promises)
				.then((membersData) => {
					setMembers(membersData);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [currentTeam.members])

	const handleSendFriendRequest = (user) => {
		sendFriendRequest(userData.handle, user)
	}

	const handleRemoveFriends = (user) => {
		removeFriends(userData.handle, user)
	}

	return (
		<div className="h-screen flex justify-end bg-gray-800">
			<div className="h-full flex flex-col border-r shadow-sm bg-gray-800">
				<div className="border-b border-gray-600 flex px-6 py-2 items-center justify-between shadow-xl">
					<p className={`text-white overflow-hidden transition-all ${expanded ? "w-54" : "w-0"
						}`}>Members</p>
					<button
						onClick={() => setExpanded((curr) => !curr)}
						className="p-0 p-0 rounded-lg focus:outline-none"
					>
						{expanded ? <div className='tooltip tooltip-bottom' data-tip="Hide members"><IoPeopleOutline className="text-purple-500 text-2xl" /></div> :
							<div className='tooltip tooltip-bottom' data-tip="Show members"><IoPeopleSharp className="text-purple-500 text-2xl" /></div>
						}
					</button>
				</div>
				<div
					className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-64" : "w-0"}
          `}
				>
					<div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
						<SearchBar team={currentTeam} />
						{/* Everything in the sidebar */}
						{members.length ?
							(members.map(member => {
								return (
									<div key={member.uid} className='flex items-center'>
										<TeamMember member={member} owner={currentTeam.owner} />
										{currentUser.handle !== member.handle && (
											(currentUser.friends && Object.keys(currentUser.friends).includes(member.handle)) ? (<div className='tooltip tooltip-left' data-tip='Remove friend'>
												<MdPersonAddDisabled className='ml-3 cursor-pointer text-white text-xl ' onClick={() => handleRemoveFriends(member.handle)} />
											</div>) :
												(<div className='tooltip tooltip-left' data-tip='Send friend request'>
													<BsPersonFillAdd className='ml-3 cursor-pointer text-white text-xl ' onClick={() => handleSendFriendRequest(member.handle)} />
												</div>)
										)
										}
									</div>)
							}))
							:
							(<p className='text-gray-300 p-4' style={{ fontFamily: 'Rockwell, sans-serif', fontSize: '0.8 em', lineHeight: '1.4', textAlign: 'center' }}>The quiet surrounds us.
								<br className="md:hidden lg:inline" />
								Reach out to your friends connecting the silence with shared moments and laughter.</p>)
						}
					</div>
					{/* inside the sidebar ends here */}
				</div>
			</div>
		</div >
	)
}

export default TeamSidebar