import { useContext, useEffect, useState } from 'react';
import { BsPersonFillAdd } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { IoPeopleSharp } from "react-icons/io5";
import { MdPersonAddDisabled } from "react-icons/md";
import { useParams } from 'react-router';
import AppContext from '../../context/AppContext';
import { addChannelUser, getChannelById, getGeneralChannel } from '../../services/channel.service';
import { addDmMember, createGroupDM } from '../../services/dms.service';
import { addTeamMember } from '../../services/teams.service';
import { getAllUsers, getLiveAllUsers, getLiveUserInfo, getUserByHandle, getUsersBySearchTerm, removeFriends, sendFriendRequest } from '../../services/users.service';
import TeamMember from '../TeamMember/TeamMember';

const SearchBar = ({ team, dm, channel }) => {

  const { userData } = useContext(AppContext);

  const { dmId, teamId } = useParams();

  const [allUsers, setAllUsers] = useState([]);
  const [searchParam, setSearchParam] = useState("handle");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [currentChannelUsers, setCurrentChannelUsers] = useState({});
  const [generalId, setGeneralId] = useState('');


  useEffect(() => {
    const u1 = getLiveUserInfo(data => {
      setCurrentUser(data);
    },
      userData.handle);

    return () => {
      u1();
    };
  }, [userData]);

  useEffect(() => {
    getAllUsers()
      .then((r) => setAllUsers([...r].sort((a, b) => b.createdOn - a.createdOn)))
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    const unsubscribe = getLiveAllUsers(data => setAllUsers([...data].sort((a, b) => a.handle - b.handle)));

    return () => unsubscribe();
  }, [userData]);

  useEffect(() => {
    if (!team) { return; }
    getGeneralChannel(team.id)
      .then(generalId => setGeneralId(generalId));
  }, [team]);

  useEffect(() => {
    if (channel) {
      getChannelById(channel)
        .then(channel => Promise.all(Object.keys(channel.members).map(member => getUserByHandle(member)
          .then(snapshot => snapshot.exists() ? snapshot.val() : {})))
          .then(members => setCurrentChannelUsers(members)));
    }
  }, [channel]);

  const handleAddMember = (user) => {
    if (dmId) {
      const dmMembers = Object.keys(dm.members);

      if (dmMembers.length === 2) {
        const partner = dmMembers.find(member => member !== userData.handle);
        createGroupDM(partner, userData.handle, user, dm.id);
        return;
      }

      addDmMember(user, dm.id);
    }

    if (teamId) {
      channel === generalId
        ? addTeamMember(user, team.id)
        : addChannelUser(channel, user);
    }
  };

  const handleSendFriendRequest = (user) => {
    sendFriendRequest(userData.handle, user);
  };

  const handleRemoveFriends = (user) => {
    removeFriends(userData.handle, user);
  };

  const handleSearchTerm = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (channel && generalId) {
      channel === generalId
        ? setSearchedUsers(getUsersBySearchTerm(allUsers, searchParam, searchTerm))
        : setSearchedUsers(getUsersBySearchTerm(currentChannelUsers, searchParam, searchTerm));
    } else {
      setSearchedUsers(getUsersBySearchTerm(allUsers, searchParam, searchTerm));
    }
  };

  return (
    <>
      <div>
        <form className='pl-2 pr-2 pt-8 pb-3'>
          <div className="flex items-center">
            <input
              type="search"
              placeholder={`Search by ${searchParam === 'handle' ? 'username' : searchParam}...`}
              className='flex-grow h-7 p-4 rounded-full bg-gray-600 text-gray-200'
              onChange={handleSearchTerm}
            />
            <div className="dropdown dropdown-click dropdown-end">
              <label className="h-7 w-7 bg-gray-600 rounded-full flex items-center justify-center hover:bg-slate-600 cursor-pointer" tabIndex={0} ><IoIosArrowDown /></label>
              <ul className="dropdown-content z-[1] menu p-2 shadow bg-gray-500 rounded-box w-52" tabIndex={0}>
                <li><a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100" role="menuitem" onClick={() => setSearchParam('handle')}>By username</a></li>
                <li><a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100" role="menuitem" onClick={() => setSearchParam('email')}>By Email</a></li>
                <li><a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100" role="menuitem" onClick={() => setSearchParam('firstName')}>By First Name</a></li>
              </ul>
            </div>
          </div>
        </form>
      </div>


      {searchedUsers.length > 0 && <div className={`
				w-[auto]
				h-[${searchedUsers.lenth >= 3 ? '200' : searchedUsers.lenth === 2 ? '132' : '66'}px]
				overflow-y-scroll custom-scrollbar rounded bg-gray-500 bg-opacity-50 relative
				`}>

        {searchedUsers.map(regUser => {
          console.log(regUser)
          return (<div key={regUser.uid}>
            <div className='flex items-center pr-0'>
              <TeamMember member={regUser} />
              {(team || channel) &&
                <div className='tooltip tooltip-left mr-0 ml-auto'
                  data-tip={dmId
                    ? 'Add to chat'
                    : teamId && team.owner === currentUser.handle && channel === generalId
                      ? 'Add to team'
                      : 'Add to channel'}
                >{currentUser.handle !== regUser.handle &&
                  <IoPeopleSharp className='cursor-pointer text-white text-xl'
                    onClick={() => handleAddMember(regUser.handle)}
                  />
                  }
                </div>

              }

              {currentUser.handle !== regUser.handle && (
                (currentUser.friends && Object.keys(currentUser.friends).includes(regUser.handle))
                  ? (<div className='tooltip tooltip-left mr-0 ml-1' data-tip='Remove friend'>
                    <MdPersonAddDisabled className='ml-2 mr-2 cursor-pointer text-white text-xl'
                      onClick={() => handleRemoveFriends(regUser.handle)}
                    />
                  </div>)
                  : (<div className='tooltip tooltip-left mr-0 ml-1' data-tip='Send friend request'>
                    <BsPersonFillAdd className='ml-2 mr-2 cursor-pointer text-white text-xl'
                      onClick={() => handleSendFriendRequest(regUser.handle)}
                    />
                  </div>)
              )
              }
            </div>
            <div className="border-t border-gray-500 border-opacity-50"></div>
          </div>
          )
        })
        }
      </div>
      }
    </>
  );
};

export default SearchBar;
