import { useContext, useEffect, useRef, useState } from 'react';
import { BsCalendarEvent } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate, useParams } from "react-router";
import { MAX_CHANNEL_LENGTH, MIN_CHANNEL_LENGTH } from '../../common/constants';
import AppContext from '../../context/AppContext';
import { addChannel, getChannelById, getChannelIdsInTeamByUser, getChannelInTeamByName, getGeneralChannel, getLiveChannelsByTeam } from '../../services/channel.service';
import { getDMById, getLiveGroupDMs, getLiveUserDMs } from '../../services/dms.service';
import { getLiveMeetingsByHandle } from '../../services/meetings.service';
import { getAllTeamMembers, getLiveTeamInfo } from '../../services/teams.service';
import { getAllUsers, getUserByHandle } from '../../services/users.service';
import ChannelTile from '../ChannelTile/ChannelTile';
import CreateMeetingModal from '../CreateMeetingModal/CreateMeetingModal';
import GroupDmTile from '../GroupDmTile/GroupDmTile';
import MeetingTile from '../MeetingTile/MeetingTile';
import ProfileBar from '../ProfileBar/ProfileBar';
import SearchBarChoose from '../SearchBarChoose/SearchBarChoose';
import TeamMember from '../TeamMember/TeamMember';

const MyServers = () => {

  const { userData } = useContext(AppContext);

  const { teamId, dmId, meetingId, channelId } = useParams();

  const [currentTeam, setCurrentTeam] = useState({});
  const [currentChannels, setCurrentChannels] = useState([]);
  const [generalId, setGeneralId] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [checkedChannels, setCheckedChannels] = useState(0);
  const [allDms, setAllDms] = useState([]);
  const [arialChannels, setArialChannels] = useState('Sidebar with create meetings button, create channel button and a list of all channels and meetings you are part of');
  const [arialDM, setArialDM] = useState('Sidebar with a list of direct messages');

  const modalRef = useRef(null);

  const [channelName, setChannelName] = useState('');

  const [channelMembers, setChannelMembers] = useState('');
  const [createMeetingModal, setCreateMeetingModal] = useState(false);

  const [isPublic, setIsPublic] = useState(true);

  const [allTeamMembers, setAllTeamMembers] = useState([]);

  const [channelError, setChannelError] = useState('');
  const [dms, setDms] = useState(userData.DMs ? Object.entries(userData.DMs) : []);

  const [groupDMs, setGroupDms] = useState(userData.groupDMs ? Object.keys(userData.groupDMs) : []);
  const [meetings, setMeetings] = useState([]);
  const [currentUserMeetings, setCurrentUserMeetings] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers()
      .then((r) => {
        setChannelMembers([...r].sort((a, b) => b.createdOn - a.createdOn));
      })
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (currentTeam.meetings && currentUserMeetings) {
      const teamMeetings = Object.keys(currentTeam.meetings);
      const filteredMeetings = teamMeetings.filter(meetingId => currentUserMeetings.includes(meetingId) ? meetingId : null);

      setMeetings(filteredMeetings);
    } else {
      setMeetings([]);
    }
  }, [currentTeam?.meetings, currentUserMeetings]);

  useEffect(() => {
    if (!teamId) { return; }

    const unsubscribe = getLiveTeamInfo(data => {
      setCurrentTeam({ ...data });
    }, teamId);

    getChannelIdsInTeamByUser(teamId, userData.handle)
      .then(channels => setCurrentChannels(channels))
      .catch((e) => console.error(e));

    getGeneralChannel(teamId)
      .then((r) => {
        setGeneralId(r);
      })
      .catch((e) => console.error(e));

    getAllTeamMembers(teamId)
      .then(memberHandles => Promise.all(memberHandles.map(memberHandle => getUserByHandle(memberHandle)
        .then(answer => answer.val())
      ))
        .then(members => {
          setAllTeamMembers(members);

          const formattedMembers = {};
          members.map(member => (formattedMembers[member.handle] = false));
          setChannelMembers({ ...formattedMembers });
        }))
      .catch((e) => console.error(e));

    const unsub = getLiveMeetingsByHandle(data => {
      setCurrentUserMeetings(data);
    }, userData?.handle)

    return () => {
      unsubscribe();
      unsub();
    }
  }, [teamId]);

  useEffect(() => {
    const unsubscribe = getLiveGroupDMs(data => {
      setGroupDms(Object.keys(data));
    }, userData.handle);

    const unsub = getLiveUserDMs(data => {
      setDms(Object.entries(data));
    }, userData.handle);

    return () => {
      unsubscribe();
      unsub();
    };
  }, [dmId, userData]);

  useEffect(() => {
    const unsubscribe = getLiveChannelsByTeam(data => {
      Promise.all(data.map(channelId => getChannelById(channelId)))
        .then(channels => {
          const filteredCHanneld = channels.filter(channel => Object.keys(channel.members).includes(userData.handle));
          setCurrentChannels(filteredCHanneld.map(channel => channel.id));
        })
        .catch((e) => console.error(e));
    }, teamId);

    return () => {
      unsubscribe();
    };
  }, [channelId]);


  const createChannel = (e) => {
    e.preventDefault();

    if (!teamId) return;

    if (channelName.length < MIN_CHANNEL_LENGTH || channelName.length > MAX_CHANNEL_LENGTH) {
      setChannelError('Channel name must be between 3 and 40 characters');
      throw new Error('Channel name must be between 3 and 40 characters');
    }

    setChannelError('');

    if (!teamId) { return; }

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
      .catch((e) => console.error(e));

    setChannelName('');
    modalRef.current.close();
  };

  const handleAddMember = (userHandle) => setChannelMembers({
    ...channelMembers,
    [userHandle]: !channelMembers[userHandle],
  });

  const updateCheckedChannels = (newValue) => {
    if (newValue >= 0 && newValue <= currentChannels.length) {
      setCheckedChannels(newValue);
    }
  };

  useEffect(() => {
    if (dms) {
      const promises = dms.map(([_, dmId]) => {
        return getDMById(dmId)
          .then((snapshot) => snapshot.val())
          .catch((e) => console.error(e));
      });

      Promise.all(promises)
        .then((dmData) => setAllDms(dmData))
        .catch((e) => console.error(e));
    }
  }, [dms]);

  return (
    <>
      <div className={`bg-gray-800 h-screen max-w-[220px] text-purple-lighter overflow-y-scroll no-scrollbar flex-col md:flex-col ${expanded ? "w-54" : "w-10"} pb-6 md:block`}>

        <div className="flex flex-col h-screen" aria-label={channelId ? arialChannels : arialDM}>
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

            <dialog ref={modalRef} id="create-channel" className="modal bg-black bg-opacity-25 backdrop-blur-sm">
              <div className="modal-box bg-gray-800 flex flex-col items-center overflow-y-scroll no-scrollbar" style={{ width: '550px', height: '350px' }}>
                <h3 className="text-lg py-2 text-white">Enter Channel name</h3>
                <input type='text' className='rounded-md' value={channelName} onChange={(e) => setChannelName(e.target.value)} style={{ width: '400px', height: '35px' }} /><br />
                <span className="bg-red text-red-300">{channelError}</span>

                <div className="modal-action">

                  <form method="dialog" className='mr-7'>
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
                  setCurrentChannels={setCurrentChannels}
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
  );
};

export default MyServers;
