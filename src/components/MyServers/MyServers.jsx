import React, { useState, useEffect, useContext, useRef } from 'react'
import { GoChevronDown, GoChevronUp, GoPlus } from "react-icons/go";

import { getAllTeamMembers, getLiveTeamInfo, getTeamById } from '../../services/teams.service';
import { useLocation, useNavigate, useParams } from "react-router"

import ProfileBar from '../ProfileBar/ProfileBar';
import App from '../../App';
import AppContext from '../../context/AppContext';
import ChannelTile from '../ChannelTile/ChannelTile';
import { addChannel, addChannelUser, getChannelById, getChannelIdsInTeamByUser, getChannelInTeamByName, getGeneralChannel } from '../../services/channel.service';
import TeamMember from '../TeamMember/TeamMember';
import { BsPersonFillAdd } from 'react-icons/bs';
import { getAllUsers, getUsersBySearchTerm } from '../../services/users.service';
import { IoIosArrowDown } from 'react-icons/io';
import SearchBar from '../SearchBar/SearchBar';
import { MAX_CHANNELNAMELENGTH, MIN_CHANNELNAME_LENGTH } from '../../common/constants';

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

	const [generalId, setGeneralId] = useState('');

	const modalRef = useRef(null);

	// const { userData } = useContext(AppContext)

	const [channelName, setChannelName] = useState('');
	const [channelMembers, setChannelMembers] = useState('');

	const [channelError, setChannelError] = useState('');

	const [dms, setDms] = useState(userData.DMs ? Object.values(userData.DMs) : [])

	useEffect(() => {
		getAllUsers()
			.then((r) => {
				setChannelMembers([...r].sort((a, b) => b.createdOn - a.createdOn));
			});
	}, []);

	useEffect(() => {
		if (!teamId) { return; }

		const unsubscribe = getLiveTeamInfo(data => {

			setCurrentTeam({ ...data })

		}, teamId);

		getGeneralChannel(teamId)
			.then((r) => {
				setGeneralId(r);
				console.log(r);
			});

		return () => {
			unsubscribe();
		}
	}, [teamId]);

	const createChannel = (e) => {
		e.preventDefault();
		if (channelName.length < MIN_CHANNELNAME_LENGTH || channelName > MAX_CHANNELNAMELENGTH) {
			setChannelError('Channel name must be between 3 and 40 characters');
			throw new Error('Channel name must be between 3 and 40 characters');

		}
		setChannelError('');
		getChannelInTeamByName(teamId, channelName)
			.then(answer => {
				if (answer !== 'No such channel') {
					setChannelError(`Channel ${channelName} already exists`);
					throw new Error(`Channel ${channelName} already exists`);
				}

				addChannel(teamId, channelName, true,channelMembers)
					.then(channelId => {
						navigate(`/teams/${teamId}/channels/${channelId}`);
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
		<div className="bg-gray-800 h-screen text-purple-lighter flex-col md:flex-col w-64 pb-6 md:block">

			<div className="flex flex-col h-screen">
				<div className="text-white mb-2 mt-3 px-4 flex justify-between border-b border-gray-600 py-1 shadow-xl">
					<div className="flex-auto">
						<h1 className="font-semibold text-xl leading-tight mb-1 truncate">{teamId ? `${currentTeam.name}` : 'Direct Messages'}</h1>
					</div>
					{/* <div>
						{isOpen ? (
							<GoChevronUp onClick={toggleAccordion} className="h-6 w-6 cursor-pointer" />
						) : (
							<GoChevronDown onClick={toggleAccordion} className="h-6 w-6 cursor-pointer" />
						)}
					</div> */}
				</div>
				<div className='flex mx-auto content-center items-center'>
					<div className='text-xl mr-4'>
						Channels
					</div>
					{teamId && <div
						className="cursor-pointer"

						onClick={() => document.getElementById("create-channel").showModal()}
					>
						<div className="bg-white opacity-25 h-8 w-8 flex items-center justify-center text-black text-2xl font-semibold rounded-2xl mb-1 overflow-hidden">
							<GoPlus className="h-10 w-10" />
						</div>
					</div>}
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
				{currentTeam?.channels && generalId
					? getChannelIdsInTeamByUser(teamId, userData.handle)
						.then(channelIds => channelIds.map(channelId => {
							console.log(channelId);
							<ChannelTile key={channelId} channelTileId={channelId} generalId={generalId} />
						}
						))
					: null}
				<div className="flex-grow"></div>

				<ProfileBar />
			</div>
		</div>
	)
}

export default MyServers;
