import React, { useState, useEffect, useContext, useRef } from 'react'
import { GoChevronDown, GoChevronUp, GoPlus } from "react-icons/go";

import { getAllTeamMembers, getLiveTeamInfo, getTeamById } from '../../services/teams.service';
import { useLocation, useNavigate, useParams } from "react-router"

import ProfileBar from '../ProfileBar/ProfileBar';
import App from '../../App';
import AppContext from '../../context/AppContext';
import ChannelTile from '../ChannelTile/ChannelTile';
import { addChannel, addChannelUser, getChannelById, getChannelInTeamByName } from '../../services/channel.service';
import TeamMember from '../TeamMember/TeamMember';
import { BsPersonFillAdd } from 'react-icons/bs';
import { getAllUsers, getUsersBySearchTerm } from '../../services/users.service';
import { IoIosArrowDown } from 'react-icons/io';
import SearchBar from '../SearchBar/SearchBar';
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

const MyServers = () => {

	const [isOpen, setIsOpen] = useState(false);

	const { userData } = useContext(AppContext);
	const { teamId, dmId } = useParams();

	const navigate = useNavigate();

	const [currentTeam, setCurrentTeam] = useState({});
	const [currentChannels, setCurrentChannels] = useState({});
	const [searchParam, setSearchParam] = useState("handle");
	const [searchTerm, setSearchTerm] = useState('');
	const [searchedUsers, setSearchedUsers] = useState([]);
	const [expanded, setExpanded] = useState(false)

	const modalRef = useRef(null);

	// const { userData } = useContext(AppContext);

	const [channelName, setChannelName] = useState('');
	const [channelMembers, setChannelMembers] = useState('');

	const [channelError, setChannelError] = useState('');

	const [dms, setDms] = useState(userData.DMs ? Object.values(userData.DMs) : [])

	useEffect(() => {
		getAllUsers()
			.then((r) => {
				setChannelMembers([...r].sort((a, b) => b.createdOn - a.createdOn));
			})
	}, []);

	useEffect(() => {
		console.log('get team info');

		const unsubscribe = getLiveTeamInfo(data => {

			setCurrentTeam({ ...data })

		}, teamId)
		return () => {
			unsubscribe();
		}

	}, [teamId]);

	const createChannel = (e) => {
		e.preventDefault();
		if (channelName.length < 3 || channelName > 40) { //magic numbers
			setChannelError('Channel name must be between 3 and 40 characters');
			throw new Error('Channel name must be between 3 and 40 characters');

		}
		setChannelError('');
		getChannelInTeamByName(teamId, channelName)
			.then(answer => {
				console.log(answer);
				console.table(answer);
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

	return (

		<div className={`bg-gray-800 h-screen text-purple-lighter flex-col md:flex-col ${expanded ? "w-54" : "w-10"} pb-6 md:block`}>

			<div className="flex flex-col h-screen">
				<div className="text-white mb-2 mt-3 px-4 flex justify-between border-b border-gray-600 py-1 shadow-xl">
					<div className="flex justify-between items-center w-full">
						<h1
							style={{ fontFamily: 'Rockwell, sans-serif' }}
							className={`font-semibold text-xl leading-tight mb-1 truncate ${expanded ? '' : 'hidden'}`}>
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
				<div className={`${expanded ? '' : 'hidden'}`}>
					{currentTeam?.channels
						? Object.keys(currentTeam.channels).map((channelId) => <ChannelTile key={channelId} channelId={channelId} />)
						: null}
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
