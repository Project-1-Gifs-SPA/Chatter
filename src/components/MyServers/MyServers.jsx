import React, { useState, useEffect, useContext, useRef } from 'react'
import { GoChevronDown, GoChevronUp, GoPlus } from "react-icons/go";

import { getAllTeamMembers, getLiveTeamInfo, getTeamById } from '../../services/teams.service';
import { useLocation, useNavigate, useParams } from "react-router"

import ProfileBar from '../ProfileBar/ProfileBar';
import App from '../../App';
import AppContext from '../../context/AppContext';
import ChannelTile from '../ChannelTile/ChannelTile';
import { addChannel, addChannelUser, getChannelById, getChannelInTeamByName, getLiveChannelSeenBy } from '../../services/channel.service';
import TeamMember from '../TeamMember/TeamMember';
import { BsPersonFillAdd } from 'react-icons/bs';
import { getAllUsers, getUsersBySearchTerm } from '../../services/users.service';
import { IoIosArrowDown } from 'react-icons/io';
import SearchBar from '../SearchBar/SearchBar';

import GroupDmTile from '../GroupDmTile/GroupDmTile';
import { getDMById, getLiveDMs, getLiveDmMembers, getLiveGroupDMs, getLiveIsDMSeen, getLiveUserDMs } from '../../services/dms.service';

import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { MAX_CHANNEL_LENGTH, MIN_CHANNEL_LENGTH } from '../../common/constants';
import { setChannelSeenBy, setTeamSeenBy, setTeamsNotSeenBy } from '../../services/chat.service';

const MyServers = () => {

	const { userData } = useContext(AppContext);
	const { teamId, dmId } = useParams();

	const navigate = useNavigate();

	const [currentTeam, setCurrentTeam] = useState({});
	const [currentChannels, setCurrentChannels] = useState({});
	const [searchParam, setSearchParam] = useState("handle");
	const [searchTerm, setSearchTerm] = useState('');
	const [searchedUsers, setSearchedUsers] = useState([]);
	const [expanded, setExpanded] = useState(true)
	const [checkedChannels, setCheckedChannels] = useState(0);
	const [allDms, setAllDms] = useState([])
	const [isDmSeen, setIsDmSeen] = useState([])

	const modalRef = useRef(null);

	const [channelName, setChannelName] = useState('');
	const [channelMembers, setChannelMembers] = useState('');

	const [channelError, setChannelError] = useState('');

	const [dms, setDms] = useState(userData.DMs ? Object.entries(userData.DMs) : [])
	const [groupDMs, setGroupDms] = useState(userData.groupDMs ? Object.keys(userData.groupDMs) : []);

	useEffect(() => {
		getAllUsers()
			.then((r) => {
				setChannelMembers([...r].sort((a, b) => b.createdOn - a.createdOn));
			})
	}, []);

	useEffect(() => {
		const unsubscribe = getLiveTeamInfo(data => {
			setCurrentTeam({ ...data })
		}, teamId)

		return () => {
			unsubscribe();
		}
	}, [teamId]);


	useEffect(() => {
		const unsubscribe = getLiveGroupDMs(data => {

			setGroupDms(Object.keys(data));
		}, userData.handle)

		const unsub = getLiveUserDMs(data => {
			setDms(Object.entries(data))
		}, userData.handle)

		return () => {
			unsubscribe();
			unsub();
		}
	}, [dmId, userData])

	const createChannel = (e) => {
		e.preventDefault();

		if (!teamId) return;

		if (channelName.length < MIN_CHANNEL_LENGTH || channelName > MAX_CHANNEL_LENGTH) {
			setChannelError('Channel name must be between 3 and 40 characters');
			throw new Error('Channel name must be between 3 and 40 characters');
		}

		setChannelError('');
		if (!teamId) return;
		getChannelInTeamByName(teamId, channelName)
			.then(answer => {
				if (answer !== 'No such channel') {
					setChannelError(`Channel ${channelName} already exists`);
					throw new Error(`Channel ${channelName} already exists`);
				}

				addChannel(teamId, channelMembers, channelName)
					.then(channelId => {
						navigate(`/teams/${teamId}/channels/${channelId}`)
					});
			})
			.catch(e => console.log(e)) //better error handling
		// document.getElementById(modalRef.current.id).close();
		// console.log(modalRef.current.id)
	}

	// const handleSearchTerm = async (e) => {
	// 	setSearchTerm(e.target.value.toLowerCase());

	// 	setSearchedUsers(getUsersBySearchTerm(await getAllTeamMembers(), searchParam, searchTerm));
	// };

	// const handleAddMember = (user) => {
	// 	addChannelUser(channelId, user);
	// }
	const updateCheckedChannels = (newValue) => {
		if (newValue >= 0 && newValue <= Object.keys(currentTeam.channels).length) {
			setCheckedChannels(newValue);
		}
	};

	useEffect(() => {
		setCheckedChannels(0);
	}, [teamId]);

	useEffect(() => {
		if (currentTeam.channels) {
			if (checkedChannels === Object.keys(currentTeam.channels).length) {
				setTeamSeenBy(teamId, userData.handle)
			} else {
				setTeamsNotSeenBy(teamId, userData.handle)
			}
		}
	}, [checkedChannels, currentTeam?.channels, teamId])

	useEffect(() => {
		if (dms) {
			const promises = dms.map(([_, dmId]) => {
				return getDMById(dmId)
					.then((snapshot) => {
						return snapshot.val();
					});
			});

			Promise.all(promises)
				.then((dmData) => {
					setAllDms(dmData);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [dms])

	return (

		<div className={`bg-gray-800 h-screen max-w-[220px] text-purple-lighter flex-col md:flex-col ${expanded ? "w-54" : "w-10"} pb-6 md:block`}>

			<div className="flex flex-col h-screen">
				<div className="text-white mb-2 mt-3 px-4 flex justify-between border-b border-gray-600 py-1 shadow-xl">
					<div className="flex justify-between items-center max-w-">
						<h1
							style={{ fontFamily: 'Rockwell, sans-serif' }}
							className={`font-semibold text-xl leading-tight mb-1 whitespace-normal ${expanded ? '' : 'hidden'}`}>
							{teamId ?
								`${currentTeam.name}` : 'Direct Messages'}
						</h1>
						{expanded ? (
							<div className='tooltip tooltip-bottom cursor-pointer' data-tip="Hide channels"><IoIosArrowBack onClick={() => setExpanded(false)} className="text-purple-500 text-2xl" /></div>
						) : (
							<div className='tooltip tooltip-bottom cursor-pointer' data-tip="Show channels"><IoIosArrowForward onClick={() => setExpanded(true)} className="text-purple-500 text-2xl" /></div>
						)
						}
					</div>
				</div>

				{teamId ? <>

					<div className={`flex mx-auto content-center items-center ${expanded ? '' : 'hidden'}`}>
						<div className='text-xl mr-4 text-white'
							style={{ fontFamily: 'Rockwell, sans-serif' }}>

							Channels
						</div>
						<div
							className="cursor-pointer"

							onClick={() => document.getElementById("create-channel").showModal()}
						>
							<div className="bg-white opacity-25 h-5 w-5 flex items-center justify-center text-black text-2xl font-semibold rounded-2xl overflow-hidden">
								<GoPlus className="h-10 w-10" />
							</div>
						</div>
					</div>

					<dialog ref={modalRef} id="create-channel" className="modal">
						<div className="modal-box">
							<h3 className="font-bold text-lg py-2">Enter Channel name</h3>
							<input type='text' value={channelName} onChange={(e) => setChannelName(e.target.value)} /><br />
							<span className="bg-red">{channelError}</span>

							<div className="modal-action">

								<form method="dialog" >

									{/* if there is a button in form, it will close the modal */}
									<button className="btn mr-5" onClick={createChannel}>Add Channel</button>
									<button className="btn">Close</button>
								</form>

							</div>
						</div>
					</dialog>
				</>
					: null}
				<div className={`${expanded ? '' : 'hidden'} flex flex-col`}>
					{currentTeam.channels
						? Object.keys(currentTeam.channels).map((channelId) => <ChannelTile key={channelId} channelId={channelId} checkedChannels={checkedChannels}
							updateCheckedChannels={updateCheckedChannels} />)
						: (
							<>
								{dms && allDms.map((dm) => {
									const partner = Object.keys(dm.members).find(member => member !== userData.handle)
									return <div key={dm.id}
										className={`hover:bg-gray-300 cursor-pointer`}>
										<TeamMember dmPartner={partner} dmId={dm.id} /></div>
								})
								}

								{groupDMs && groupDMs.map(groupDmId => <GroupDmTile key={groupDmId} groupDmId={groupDmId} />)}
							</>
						)}
				</div>

				<div className="flex-grow"></div>
				<div className={`${expanded ? '' : 'hidden'}`}>

					<ProfileBar />
				</div>
			</div>
		</div>
	)
}

export default MyServers;

// animate-blink