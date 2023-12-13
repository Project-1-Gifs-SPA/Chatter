import { useContext, useEffect, useState } from 'react';
import { IoSettingsSharp } from "react-icons/io5";
import AppContext from '../../context/AppContext';
import { getLiveUserInfo } from '../../services/users.service';
import Profile from '../../views/Profile/Profile';
import ProfileModal from '../ProfileModal/ProfileModal';

const ProfileBar = () => {

  const { userData } = useContext(AppContext);

  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(
    () => {
      const u1 = getLiveUserInfo(
        data => {
          setCurrentUser(data);
        },
        userData?.handle);
      return () => {
        u1();
      };
    }, [userData]);

  return (
    <>
      <div className="bg-gray-900 py-3 text-white flex items-center justify-between">
        <div className="flex items-center ml-2 tooltip cursor-pointer" data-tip="User profile" onClick={() => setShowModal(true)}>
          <div className={`avatar ${currentUser.availability}`}>
            <div className="w-10 rounded-full">
              <img src={currentUser.photoURL} alt="User Avatar" />
            </div>
          </div>
          <div className="ml-2 text-left">
            <p style={{ fontFamily: 'Rockwell, sans-serif' }} className='text-purple-500'>{currentUser.firstName} {currentUser.lastName}</p>
            <p className='text-sm'>@{currentUser.handle}</p>
          </div>
        </div>
        <div className="text-2xl mr-3 tooltip cursor-pointer" data-tip="User settings" onClick={() => setShowProfile(true)}>
          <IoSettingsSharp />
        </div>
      </div>
      {showModal && <ProfileModal isVisible={showModal} onClose={() => setShowModal(false)} profile={currentUser} />}
      {showProfile && <Profile isVisible={showProfile} onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default ProfileBar;
