import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { statuses } from '../../common/constants';
import AppContext from '../../context/AppContext';
import { logoutUser } from '../../services/auth.service';
import { createDM } from '../../services/dms.service';
import { changeUserStatus, getLiveUserInfo } from '../../services/users.service';

const ProfileModal = ({ isVisible, onClose, profile }) => {

  const { userData, setContext } = useContext(AppContext);

  const [currentUser, setCurrentUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modal = document.getElementById('myModal');
      if (modal && !modal.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const u1 = getLiveUserInfo(data => {
      setCurrentUser(data);
    },
      userData.handle);

    return () => {
      u1();
    };
  }, [userData]);

  const onLogout = () => {
    logoutUser()
      .then(() => {
        changeUserStatus(userData.handle, statuses.offline);
        setContext({
          user: null,
          userData: null,
        });
        navigate('/welcome');
      })
      .catch((e) => console.error(e));
  };

  if (!isVisible) return null;

  const handleSendDM = (e) => {
    e.preventDefault();

    if (userData.DMs[profile.handle]) {
      navigate(`/dms/${userData.DMs[profile.handle]}`);
    } else {
      console.log('you dont have dms with this person')
      createDM(profile.handle, userData.handle)
        .then((dmId) => navigate(`/dms/${dmId}`))
        .catch((e) => console.error(e));
    }
  };

  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
      <div id='myModal' className='w-[350px] flex flex-col'>
        <div className='bg-gray-900 p-2 rounded-xl h-[350px]'>

          <div className="flex items-center ml-5 mt-5">
            <div className={`avatar ${profile.availability}`}>
              <div className="w-20 rounded-full">
                <img src={profile.photoURL} alt="User Avatar" />
              </div>
            </div>
            <div className="ml-2 mr-10 p-3">
              <p className="text-xl font-bold text-white" style={{ fontFamily: 'Rockwell, sans-serif' }}>
                {profile.firstName} {profile.lastName}
              </p>
              <p className='text-orange-300'>@{profile.handle}</p>
              {profile.handle === currentUser.handle && <button
                className="text-white rounded btn btn-xs bg-purple-600 transition-colors hover:bg-purple-400 border-none mt-3"
                onClick={onLogout}
              >
                Sign out
              </button>}
            </div>
          </div>

          <div className='bg-gray-700 h-[150px] rounded-xl mt-5 ml-5 mr-5'>
            <div className="ml-5 mt-5 mr-5 pt-5">
              <p className="text-md font-bold text-white"
              >Chatter member since:</p>
              <p className="text-sm text-white"
              >{new Date(profile.createdOn).toLocaleDateString('en-US')}</p>
            </div>
            <div className="border-b border-gray-700 mt-3 mr-5"></div>
            <div className="mt-2 ml-5 mr-5">
              <p className="text-md font-bold text-white"
              >Status:</p>
              <p className="text-sm text-white"
              >{profile.availability.charAt(0).toUpperCase() + profile.availability.slice(1)}</p>
            </div>
          </div>
          {profile.handle !== currentUser.handle && <button
            className="text-white rounded btn btn-sm bg-orange-600 transition-colors hover:bg-orange-400 border-none ml-5 mt-2"
            onClick={handleSendDM}
          >
            Send DM
          </button>}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
