import { useState, useEffect, useContext, useRef } from 'react'
import { GoPlus } from "react-icons/go";

import { getAllTeamMembers, getLiveTeamInfo, getTeamById } from '../../services/teams.service';
import { useNavigate, useParams } from "react-router"

import ProfileBar from '../ProfileBar/ProfileBar';
import AppContext from '../../context/AppContext';
import ChannelTile from '../ChannelTile/ChannelTile';
import { addChannel, getChannelById, getChannelIdsInTeamByUser, getChannelInTeamByName, getGeneralChannel, getLiveChannelsByTeam } from '../../services/channel.service';
import TeamMember from '../TeamMember/TeamMember';
import { getAllUsers, getUserByHandle } from '../../services/users.service';
import SearchBarChoose from '../SearchBarChoose/SearchBarChoose';

import GroupDmTile from '../GroupDmTile/GroupDmTile';
import { getDMById, getLiveGroupDMs, getLiveUserDMs } from '../../services/dms.service';
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { MAX_CHANNEL_LENGTH, MIN_CHANNEL_LENGTH } from '../../common/constants';
import CreateMeetingModal from '../CreateMeetingModal/CreateMeetingModal';
import { BsCalendarEvent } from "react-icons/bs";
import MeetingTile from '../MeetingTile/MeetingTile';
import { getLiveMeetingsByHandle } from '../../services/meetings.service';


const MyServers = () => {

	// const [isOpen, setIsOpen] = useState(false);

	const { userData } = useContext(AppContext);
	const { teamId, dmId, meetingId, channelId } = useParams();

	const navigate = useNavigate();

	const [currentTeam, setCurrentTeam] = useState({});
	const [currentChannels, setCurrentChannels] = useState([]);
	const [generalId, setGeneralId] = useState('');
	const [expanded, setExpanded] = useState(true)
	const [checkedChannels, setCheckedChannels] = useState(0);
	const [allDms, setAllDms] = useState([])
	const [isDmSeen, setIsDmSeen] = useState([])

	const modalRef = useRef(null);

	const [channelName, setChannelName] = useState('');

	const [channelMembers, setChannelMembers] = useState('');
	const [createMeetingModal, setCreateMeetingModal] = useState(false);

	const [isPublic, setIsPublic] = useState(true);

	const [allTeamMembers, setAllTeamMembers] = useState([]);


	const [channelError, setChannelError] = useState('');
	const [dms, setDms] = useState(userData.DMs ? Object.entries(userData.DMs) : [])

	const [groupDMs, setGroupDms] = useState(userData.groupDMs ? Object.keys(userData.groupDMs) : []);
	const [meetings, setMeetings] = useState([]);
	const [currentUserMeetings, setCurrentUserMeetings] = useState([]);



	useEffect(() => {
		getAllUsers()
			.then((r) => {
				setChannelMembers([...r].sort((a, b) => b.createdOn - a.createdOn));
			})
	}, []);


	useEffect(() => {
		if (currentTeam.meetings && currentUserMeetings) {

			const teamMeetings = Object.keys(currentTeam.meetings)

			const filteredMeetings = teamMeetings.filter(meetingId => currentUserMeetings.includes(meetingId) ? meetingId : null);

			setMeetings(filteredMeetings)

		} else {
			setMeetings([]);
		}
	}, [currentTeam?.meetings, currentUserMeetings]);

	useEffect(() => {
		if (!teamId) { return; }

		const unsubscribe = getLiveTeamInfo(data => {
			setCurrentTeam({ ...data })
		}, teamId);

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

		const unsub = getLiveMeetingsByHandle(data => {

			// if(currentTeam.meetings){
			// const filterMeetings = Object.keys(currentTeam.meetings).filter((meetingId=> data.includes(meetingId)? meetingId:null))
			// console.log(filterMeetings)
			// setMeetings([...filterMeetings]);
			// }

			setCurrentUserMeetings(data)

		}, userData?.handle)

		return () => {
			unsubscribe();
			unsub();
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

	useEffect(() => {
		const unsubscribe = getLiveChannelsByTeam(data => {
			Promise.all(data.map(channelId => getChannelById(channelId)))
				.then(channels => {
					const filteredCHanneld = channels.filter(channel => Object.keys(channel.members).includes(userData.handle))
					setCurrentChannels(filteredCHanneld.map(channel => channel.id));

				})
			// .then(filteredChannels=> setCurrentChannels(filteredChannels))

			// setCurrentChannels(data);
		}, teamId)

		return () => {
			unsubscribe();
		}
	}, [channelId])


	const createChannel = (e) => {
		e.preventDefault();

		if (!teamId) return;

		if (channelName.length < MIN_CHANNEL_LENGTH || channelName.length > MAX_CHANNEL_LENGTH) {
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

				addChannel(teamId, channelName, isPublic, currentTeam.owner, userData.handle, Object.keys(channelMembers).filter(member => channelMembers[member]))
					.then(channelId => {
						navigate(`/teams/${teamId}/channels/${channelId}`);
					});
			})
			.catch(e => console.log(e)) //better error handling

		setChannelName('');
		modalRef.current.close()
	}

	const handleAddMember = (userHandle) => setChannelMembers({
		...channelMembers,
		[userHandle]: !channelMembers[userHandle],
	});

	const updateCheckedChannels = (newValue) => {
		if (newValue >= 0 && newValue <= currentChannels.length) {
			setCheckedChannels(newValue);
		}
	};

	// useEffect(() => {
	// 	setCheckedChannels(0);
	// }, [teamId]);

	// useEffect(() => {
	// 	console.log(checkedChannels === currentChannels.length)
	// 	if (checkedChannels === currentChannels.length) {
	// 		setTeamSeenBy(teamId, userData.handle)
	// 	} else {
	// 		setTeamsNotSeenBy(teamId, userData.handle)
	// 	}
	// }, [checkedChannels])

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
		<>
			<div className={`bg-gray-800 h-screen max-w-[220px] text-purple-lighter overflow-y-scroll no-scrollbar flex-col md:flex-col ${expanded ? "w-54" : "w-10"} pb-6 md:block`}>

				<div className="flex flex-col h-screen">
					<div className="text-white mb-1 mt-3 px-4 flex justify-between">
						<div className="flex justify-between items-center">
							<h1
								style={{ maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: 'Rockwell, sans-serif' }}
								className={` font-semibold text-xl leading-tight mb-1 whitespace-normal ${expanded ? '' : 'hidden'}`}>
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
					<div className="border-t border-gray-600 py-2"></div>

					{teamId || meetingId ? <>
						{expanded ?
							<>
								<button className="btn bg-gray-700 border-none ml-3 mr-3" onClick={() => setCreateMeetingModal(true)}>{
									<p className='flex text-white'>
										<BsCalendarEvent className='mr-3' />
										Create Meeting
									</p>}</button>
								<div className="divider mt-auto"></div>
							</>

							: null}
						{createMeetingModal ? <CreateMeetingModal setShowModal={setCreateMeetingModal} teamMembers={allTeamMembers} /> : null}
						<div className={`flex mx-auto content-center items-center ${expanded ? '' : 'hidden'}`}>

							<div className='text-xl mr-4 text-white'
								style={{ fontFamily: 'Rockwell, sans-serif' }}>

								{/* {teamId ? <>

					<div className={`flex mx-auto content-center items-center ${expanded ? '' : 'hidden'}`}>
						<div className='text-xl mr-4 text-white'
							style={{ fontFamily: 'Rockwell, sans-serif' }}> */}
								{/* main*/}


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
							{/* team-channel
//					</div></> : null}
//				</div>
					//=======*/}
						</div>
						{/*</>// main*/}

						<dialog ref={modalRef} id="create-channel" className="modal bg-black bg-opacity-25 backdrop-blur-sm">
							<div className="modal-box bg-gray-800 flex flex-col items-center overflow-y-scroll no-scrollbar" style={{ width: '550px', height: '350px' }}>
								<h3 className="text-lg py-2 text-white">Enter Channel name</h3>
								<input type='text' className='rounded-md' value={channelName} onChange={(e) => setChannelName(e.target.value)} style={{ width: '400px', height: '35px' }} /><br />
								<span className="bg-red text-red-300">{channelError}</span>

								<div className="modal-action">

									<form method="dialog" className='mr-7'>
										{/* if there is a button in form, it will close the modal */}
										<div className='flex'>
											<p className='text-white mr-3 mb-3'>Create public channel</p>
											<input type="checkbox" className="checkbox" style={{ border: '1px solid white' }}
												checked={isPublic ? "checked" : ""}
												onClick={() => setIsPublic(!isPublic)} />
										</div>

										{!isPublic && <SearchBarChoose addMembers={handleAddMember} channelMembers={channelMembers} teamMembers={allTeamMembers} />}

										<button className="btn btn-sm border-none bg-green-500 text-white mr-5 hover:bg-green-600 mr-5" onClick={createChannel}>Add Channel</button>
										<button className="btn btn-sm bg-red-500 text-white hover:bg-red-600 border-none mt-5" onClick={() => {
											setChannelError('');
											setChannelName('');
										}}>Close</button>
									</form>

								</div>
							</div>
							{/* // team-channel */}
							{/* </div> */}
							{/* </dialog > */}
							{/* //				{currentTeam?.channels && generalId
//					? currentChannels.map(channelId => <ChannelTile
//						key={channelId}
//						channelId={channelId}
//						generalId={generalId}
//						isOwner={currentTeam.owner === userData.handle}
//						addMembers={handleAddMember}
//						channelMembers={channelMembers}
//						teamMembers={allTeamMembers}
//            checkedChannels={checkedChannels}
//            updateCheckedChannels={updateCheckedChannels}
//					/>)
//======= */}
						</dialog >
					</>
						: null}
					<div className={`${expanded ? '' : 'hidden'} flex flex-col`}>
						{currentTeam.channels && teamId
							? <div className='flex flex-col mt-3'>
								{currentChannels.map((channelId) => <ChannelTile
									key={channelId}
									channelId={channelId}
									generalId={generalId}
									isOwner={currentTeam.owner === userData.handle}
									addMembers={handleAddMember}
									channelMembers={channelMembers}
									teamMembers={allTeamMembers}
									checkedChannels={checkedChannels}
									updateCheckedChannels={updateCheckedChannels}

								/>)}
							</div>
							: (
								<>
									{dms && allDms.map((dm) => {
										const partner = Object.keys(dm.members).find(member => member !== userData.handle)
										return <div key={dm.id}
											className={`hover:bg-gray-700 cursor-pointer`}>
											<TeamMember dmPartner={partner} dmId={dm.id} /></div>
									})
									}

									{groupDMs && groupDMs.map(groupDmId => <GroupDmTile key={groupDmId} groupDmId={groupDmId} />)}
								</>
							)}
					</div>
					<br />
					<div className={`${expanded ? '' : 'hidden'} flex flex-col `}>
						{(meetings.length && teamId)
							? <div className='flex flex-col mb-[110px]'>
								{meetings.map((meetingId) => <MeetingTile key={meetingId} meetingId={meetingId} />)}
							</div>
							: null
						}
					</div>
					<div className="flex-grow"></div>
					<div className={`${expanded ? '' : 'hidden'}`}>
						<ProfileBar />
					</div>
				</div >
			</div >
		</>
	)
}

export default MyServers;

{/* // animate-blink */ }