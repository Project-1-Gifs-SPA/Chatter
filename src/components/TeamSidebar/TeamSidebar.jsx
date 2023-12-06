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
import { getLiveDMs } from '../../services/dms.service';
import { getChannelById, getLiveChannelInfo } from '../../services/channel.service';

const TeamSidebar = () => {
	const { userData } = useContext(AppContext)
	const [expanded, setExpanded] = useState(false)
	const [currentTeam, setCurrentTeam] = useState({});
	const [currentChannel, setCurrentChannel] = useState({});
	const [members, setMembers] = useState([]);
	const { teamId, dmId, channelId } = useParams();
	const [currentUser, setCurrentUser] = useState({});
	const [currentDM, setCurrentDm] = useState({});
	// const [generalId, setGeneralId] = useState('');

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
		// getGeneralChannel(teamId)
			// .then(generalId => setGeneralId(generalId));

		const unsubscribe = getLiveTeamInfo(data => {
			setCurrentTeam({ ...data })
		}, teamId)
		return () => {
			unsubscribe();
		}
	}, [teamId]);

	useEffect(() => {
		getChannelById(channelId)
			.then(channel => setCurrentChannel(channel));
	}, [channelId])


	useEffect(() => {
		const unsubscribe = getLiveChannelInfo(data => {
			setCurrentChannel({ ...data })
		}, channelId)

		return () => {
			unsubscribe();
		}
	}, [channelId])

	useEffect(() => {
		const unsubscribe = getLiveDMs(data => {
			setCurrentDm({ ...data })
		}, dmId)
		return () => {
			unsubscribe();
		}
	}, [dmId]);

	useEffect(() => {
		if (currentChannel.members) {
			// const promises = channelId === generalId
			// 	? Object.keys(currentTeam.members).map(member => getUserByHandle(member)
			// 		.then(snapshot => snapshot.val())
			// 	)
			// 	: Object.keys(currentChannel.members).map(member => getUserByHandle(member)
			// 		.then(snapshot => snapshot.val())
			// 	);
			const promises = Object.keys(currentChannel.members).map(member => getUserByHandle(member)
				.then(snapshot => snapshot.val())
			);

			Promise.all(promises)
				.then((membersData) => {
					setMembers(membersData);
				})
				.catch((error) => {
					console.error(error);
				});
		}

		if (currentDM.members) {
			const promises = Object.keys(currentDM.members).map(member => {
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
	}, [currentChannel.members, currentDM.members]);

	const handleSendFriendRequest = (user) => {
		sendFriendRequest(userData.handle, user);
	}

	const handleRemoveFriends = (user) => {
		removeFriends(userData.handle, user);
	}

	return (
		<div className="h-screen flex flex-col md:flex md:block justify-end bg-gray-800">
			<div className="h-full flex flex-col border-r shadow-sm bg-gray-800">
				<div className="border-b border-gray-600 flex px-6 py-2 items-center shadow-xl">
					<button
						onClick={() => setExpanded((curr) => !curr)}
						className="p-0 p-0 rounded-lg focus:outline-none"
					>
						{expanded ? <div className='tooltip tooltip-bottom ' data-tip="Hide members"><IoPeopleOutline className="text-purple-500 text-2xl" /></div> :
							<div className='tooltip tooltip-bottom' data-tip="Show members"><IoPeopleSharp className="text-purple-500 text-2xl" /></div>
						}
					</button>
					<p className={`ml-3 text-white overflow-hidden transition-all ${expanded ? "w-54" : "w-0"
						}`}>Members</p>
				</div>
				<div
					className={`flex justify-between items-center
            overflow-hidden transition-all ${expanded ? "w-64" : "w-0"}
        `}
				>
					<div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
						<SearchBar team={currentTeam} dm={currentDM} channel={channelId} />
						{/* Everything in the sidebar */}
						{members.length > 0 ?
							(members.map(member => {
								return (
									<div key={member.uid} className='flex items-center'>
										<TeamMember member={member} owner={currentTeam.owner} />
										{currentUser.handle !== member.handle && (
											(currentUser.friends && Object.keys(currentUser.friends).includes(member.handle)) ? (<div className='tooltip tooltip-left' data-tip='Remove friend'>
												<MdPersonAddDisabled className='ml-3 cursor-pointer text-white text-xl hidden sm:flex' onClick={() => handleRemoveFriends(member.handle)} />
											</div>) :
												(<div className='tooltip tooltip-left' data-tip='Send friend request'>
													<BsPersonFillAdd className='ml-3 cursor-pointer text-white text-xl hidden sm:flex' onClick={() => handleSendFriendRequest(member.handle)} />
												</div>)
										)
										}
									</div>)
							}))
							:
							(<p className='text-gray-300 p-4 md:block ' style={{ fontFamily: 'Rockwell, sans-serif', fontSize: '0.8 em', lineHeight: '1.4', textAlign: 'center' }}>The quiet surrounds us.
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