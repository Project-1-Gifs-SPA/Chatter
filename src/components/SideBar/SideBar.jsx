import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { getLiveAllTeams } from '../../services/teams.service';
import { getLiveUserInfo } from '../../services/users.service';
import AddTeam from '../AddTeam/AddTeam';
import DMIcon from '../DMIcon/DMIcon';
import FriendsRequests from '../FriendsRequests/FriendsRequests';
import TeamIcon from '../TeamIcon/TeamIcon';

const SideBar = () => {
  const { userData } = useContext(AppContext);

  const [showModal, setShowModal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const u = getLiveUserInfo((data) => {
      setCurrentUser(data);
    }, userData?.handle);

    const unsubscribe = getLiveAllTeams((result) => {
      setAllTeams(result);
    })

    return () => {
      unsubscribe();
      u();
    }
  }, [userData]);

  useEffect(() => {
    const teamArr = [];

    if (currentUser.teams) {
      (Object.keys(currentUser.teams)).forEach(id => teamArr.push(id));
    }

    if (currentUser.myTeams) {
      (Object.keys(currentUser.myTeams)).forEach(id => teamArr.push(id));
    }

    setTeams(teamArr);
  }, [allTeams, currentUser]);

  return (
    <>
      <div className="flex flex-col md:flex-col justify-between h-screen bg-gray-900" aria-label='navigation bar for teams with icons for each team and a create team button'>
        <div className="bg-gray-900 text-purple-lighter flex-none w-24 p-6 md:block">
          <DMIcon />
          {teams.length ?
            teams.map(teamId => {
              return <div key={teamId}>
                <TeamIcon id={teamId} />
              </div>
            }) : null
          }
          <AddTeam />
        </div >

        <button onClick={() => setShowModal(true)}
          className="btn mb-2 bg-gray-800 border-none text-white text-sm"
          style={{ width: '80px', height: '70px', padding: '4px 8px' }}
        >
          <div className="badge badge-secondary badge-xs">
            {currentUser.friendRequests ? `+${Object.keys(currentUser.friendRequests).length}` : 0}
          </div>
          Friends requests
        </button>
      </div >
      {showModal && <FriendsRequests friendsRequests={currentUser.friendRequests} onClose={() => setShowModal(false)} />
      }
    </>
  );
};

export default SideBar;
