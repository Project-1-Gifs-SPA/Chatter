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
import { getAllUsers, getUserByHandle, getUsersBySearchTerm } from '../../services/users.service';
import { IoIosArrowDown } from 'react-icons/io';
import SearchBar from '../SearchBar/SearchBar';
import { MAX_CHANNELNAMELENGTH, MIN_CHANNELNAME_LENGTH } from '../../common/constants';
// import CleanSearchBar from '../CleanSearchBar/CleanSearchBar';
import { IoAdd, IoRemove } from 'react-icons/io5';

const MyServers = () => {

	const [isOpen, setIsOpen] = useState(false);

	const { userData } = useContext(AppContext);
	const { teamId, dmId } = useParams();

	const [team, setTeam] = useState('');

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
	const [isPublic, setIsPublic] = useState(true);
	const [channelMembers, setChannelMembers] = useState({});
	const [allTeamMembers, setAllTeamMembers] = useState([]);

	const [channelError, setChannelError] = useState('');

	const [dms, setDms] = useState(userData.DMs ? Object.values(userData.DMs) : [])

	useEffect(() => {
		if (!teamId) { return; }

		const unsubscribe = getLiveTeamInfo(data => {

			setCurrentTeam({ ...data })

		}, teamId);

		getTeamById(teamId)
			.then(team => setTeam(team));

		getChannelIdsInTeamByUser(teamId, userData.handle)
			.then(channels => setCurrentChannels(channels));

		getGeneralChannel(teamId)
			.then((r) => {
				setGeneralId(r);
			});

		getAllTeamMembers(teamId)
			.then(memberHandles => Promise.all(memberHandles.map(memberHandle => getUserByHandle(memberHandle)
				.then(answer => answer.val())
			))
				.then(members => {
					setAllTeamMembers(members);

					const formattedMembers = {};
					members.map(member => (formattedMembers[member.handle] = false));
					setChannelMembers({ ...formattedMembers });
				}));

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

				addChannel(teamId, channelName, isPublic, Object.keys(channelMembers).filter(member => channelMembers[member]))
					.then(channelId => {
						navigate(`/teams/${teamId}/channels/${channelId}`);
					});
			})

			.catch(e => console.log(e)) //better error handling
	}

	const handleSearchTerm = (e) => {
		setSearchTerm(e.target.value.toLowerCase());
		setSearchedUsers(getUsersBySearchTerm(allTeamMembers, searchParam, e.target.value));
	};

	const handleAddMember = (userHandle) => setChannelMembers({
			...channelMembers,
			[userHandle]: !channelMembers[userHandle],
		});

	return (
		<div className="bg-gray-800 h-screen text-purple-lighter flex-col md:flex-col w-64 pb-6 md:block">

			<div className="flex flex-col h-screen">
				<div className="text-white mb-2 mt-3 px-4 flex justify-between border-b border-gray-600 py-1 shadow-xl">
					<div className="flex-auto">
						<h1 className="font-semibold text-xl leading-tight mb-1 truncate">{teamId ? `${currentTeam.name}` : 'Direct Messages'}</h1>
					</div>
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
								<div className='flex-auto'>
									<p>Create public channel</p>
									<input type="checkbox" className="checkbox"
										checked={isPublic ? "checked" : ""}
										onClick={() => setIsPublic(!isPublic)} />
								</div>

								{!isPublic ? <>
									<div>
										{/* <form className='pl-2 pr-2 pt-8 pb-3'> */}
										<div className="flex items-center">
											<input
												type="search"
												placeholder={`Search by ${searchParam === 'handle' ? 'username' : searchParam}...`}
												className='flex-grow h-7 p-4 rounded-full bg-slate-700 text-gray-200'
												onChange={handleSearchTerm}
											/>
											<div className="dropdown dropdown-hover dropdown-end">
												<label className="h-7 w-7 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 cursor-pointer" tabIndex={0} ><IoIosArrowDown /></label>
												<ul className="dropdown-content z-[1] menu p-2 shadow bg-gray-600 rounded-box w-52" tabIndex={0}>
													<li><a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100" role="menuitem" onClick={() => setSearchParam('handle')}>By username</a></li>
													<li><a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100" role="menuitem" onClick={() => setSearchParam('email')}>By Email</a></li>
													<li><a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100" role="menuitem" onClick={() => setSearchParam('firstName')}>By First Name</a></li>
												</ul>
											</div>
										</div>
										{/* </form> */}
									</div>

									{searchedUsers && <div className='w-[auto] rounded bg-gray-700 bg-opacity-90 relative z-50'>
										{searchedUsers.map(regUser =>
											<div key={regUser.uid} className='flex items-center'>
												<TeamMember key={regUser.handle} member={regUser} />
												<div className='tooltip' data-tip='Add to channel'>
													{channelMembers[regUser.handle]
														? <IoRemove className='cursor-pointer text-white text-xl ' onClick={() => handleAddMember(regUser.handle)} />
														: <IoAdd className='cursor-pointer text-white text-xl ' onClick={() => handleAddMember(regUser.handle)} />}
												</div>
											</div>
										)
										}
									</div>
									}</> : null}
								<button className="btn mr-5" onClick={createChannel}>Add Channel</button>
								<button className="btn">Close</button>
							</form>

						</div>
					</div>
				</dialog>
				{currentTeam?.channels && generalId
					? currentChannels.map(channelId => <ChannelTile key={channelId} channelTileId={channelId} generalId={generalId} />)
					: null}
				<div className="flex-grow"></div>

				<ProfileBar />
			</div>
		</div>
	)
}

export default MyServers;
