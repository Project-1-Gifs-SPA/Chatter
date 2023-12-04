import { useState, useEffect, useContext, useRef } from 'react'
import { GoPlus } from "react-icons/go";

import { getAllTeamMembers, getLiveTeamInfo, getTeamById } from '../../services/teams.service';
import { useNavigate, useParams } from "react-router"

import ProfileBar from '../ProfileBar/ProfileBar';
import AppContext from '../../context/AppContext';
import ChannelTile from '../ChannelTile/ChannelTile';
import { addChannel, getChannelIdsInTeamByUser, getChannelInTeamByName, getGeneralChannel } from '../../services/channel.service';
import TeamMember from '../TeamMember/TeamMember';
import { getUserByHandle, getUsersBySearchTerm } from '../../services/users.service';
import { IoIosArrowDown } from 'react-icons/io';
import { MAX_CHANNELNAMELENGTH, MIN_CHANNELNAME_LENGTH } from '../../common/constants';
// import CleanSearchBar from '../CleanSearchBar/CleanSearchBar';
import { IoAdd, IoRemove } from 'react-icons/io5';
import SearchBarChoose from '../SearchBarChoose/SearchBarChoose';

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

								{!isPublic && <SearchBarChoose addMembers={handleAddMember} channelMembers={channelMembers} teamMembers={allTeamMembers} />}

								<button className="btn mr-5" onClick={createChannel}>Add Channel</button>
								<button className="btn">Close</button>
							</form>

						</div>
					</div>
				</dialog>
				{currentTeam?.channels && generalId
					? currentChannels.map(channelId => <ChannelTile
						key={channelId}
						channelTileId={channelId}
						generalId={generalId}
						isOwner={currentTeam.owner === userData.handle}
						addMembers={handleAddMember}
						channelMembers={channelMembers}
						teamMembers={allTeamMembers}
					/>)
					: null}
				<div className="flex-grow"></div>

				<ProfileBar />
			</div>
		</div>
	)
}

export default MyServers;
