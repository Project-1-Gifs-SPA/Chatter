import { useContext, useEffect, useRef, useState } from 'react';
import { MAX_USERNAME_LENGTH, MIN_NAME_LENGTH, isValidPhoneNumber } from '../../common/constants';
import AppContext from '../../context/AppContext';
import { upload } from '../../services/storage.service';
import { getLiveUserInfo, writeUserData } from '../../services/users.service';

const Profile = ({ isVisible, onClose }) => {

  const { user, userData } = useContext(AppContext);

  const [photo, setPhoto] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  const inputRef = useRef(null);

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

  useEffect(
    () => {
      const u1 = getLiveUserInfo(data => {
        setCurrentUser(data);
        setNewFirstName(data.firstName);
        setNewLastName(data.lastName);
        setNewPhoneNumber(data.phoneNumber);
      },
        userData.handle);

      return () => {
        u1();
      };
    }, [userData]);

  useEffect(() => {
    if (showAlert) {
      const timeout = setTimeout(() => {
        setShowAlert(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [showAlert]);

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (e.target.files[0] !== null) {
      setFileName(file.name);
      setPhoto(e.target.files[0]);
    }
  }

  const handleSaveChanges = (e) => {
    e.preventDefault();

    if (newFirstName.length < MIN_NAME_LENGTH || newFirstName.length > MAX_USERNAME_LENGTH) {
      alert('Name must be between 4 and 35 characters!');
      return;
    }

    if (newLastName.length < MIN_NAME_LENGTH || newLastName.length > MAX_USERNAME_LENGTH) {
      alert('Last name must be between 4 and 35 characters!');
      return;
    }

    if (!isValidPhoneNumber(newPhoneNumber)) {
      alert('Invalid phone number!');
      return;
    }

    writeUserData(currentUser.handle, newFirstName, newLastName, newPhoneNumber);
    setShowAlert(true);

    if (photo) {
      upload(photo, user, setLoading);
      setShowAlert(true);
      setFileName('');
    }
  };

  const handleDiscardChanges = () => {
    setNewFirstName(currentUser.firstName);
    setNewLastName(currentUser.lastName);
    setNewPhoneNumber(currentUser.phoneNumber);
    setFileName('');
    setPhoto(null);
  };

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
      <div id='myModal' className='w-[550px] flex flex-col'>
        <div className='bg-gray-900 p-2 rounded-xl h-[660px]'>

          <div className="flex flex-col items-center mt-5 text-white">
            <p style={{ fontFamily: 'Rockwell, sans-serif' }} className='text-4xl font-bold text-purple-400'>{currentUser.firstName} {currentUser.lastName}</p>
            <p className='text-orange-300 text-lg'>@{currentUser.handle}</p>
          </div>

          {/* Avatar section */}
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row space-y-6 md:space-x-6">
              <div className="flex items-center">
                <div className={`avatar ${currentUser.availability}`}>
                  <div className="w-20 rounded-full">
                    <img src={currentUser.photoURL} alt="User Avatar" />
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col justify-center">
                <input className="bg-white py-1 px-2 rounded-lg cursor-pointer text-sm" onClick={() => inputRef.current.click()} placeholder={fileName === '' ? "Choose between .jpg, .png" : fileName} />
                <input className="hidden" ref={inputRef} type='file' accept="image/jpeg, image/png, image/jpg" onChange={handleChange} />
                <div>
                  <button className="btn btn-primary btn-sm w-15 mt-2 text-sm" onClick={() => inputRef.current.click()}>Choose File</button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className='h-[360px] w-[360px] pt-5 rounded-xl mt-5 ml-5 mr-5'>
              <div className="flex flex-col items-center text-white">
                <p style={{ fontFamily: 'Rockwell, sans-serif' }} className='text-xl text-purple-400'>Edit your profile info</p>
              </div>
              <div className="flex justify-center">
                <div className="form-control pl-7 pr-7 flex">
                  <label className="form-label text-white">First name</label>
                  <input
                    className="input input-bordered w-[300px]"
                    style={{ backgroundColor: 'white' }}
                    maxLength="35"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    type="text"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="form-control pt-3 pl-7 pr-7">
                  <label className="form-label text-white">Last name</label>
                  <input
                    className="input input-bordered w-[300px]"
                    style={{ backgroundColor: 'white' }}
                    maxLength="35"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder={currentUser.lastName}
                    type="text"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="form-control pt-3 pl-7 pr-7">
                  <label className="form-label text-white">Phone number</label>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <input
                        className="input input-bordered w-[300px]"
                        style={{ backgroundColor: 'white' }}
                        maxLength="32"
                        value={newPhoneNumber}
                        onChange={(e) => setNewPhoneNumber(e.target.value)}
                        placeholder={currentUser.phoneNumber}
                        type="tel"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex justify-center pt-3 pr-7 items-center '>
                <button
                  onClick={handleSaveChanges}
                  className="btn btn-sm border-none bg-green-500 text-white px-4 py-2 ml-3 rounded-md transition-colors duration-300 hover:bg-green-600"
                >
                  Save changes
                </button>
                <button
                  onClick={handleDiscardChanges}
                  className="btn btn-sm border-none bg-red-500 text-white px-4 py-2 ml-3 rounded-md transition-colors duration-300 hover:bg-red-600 "
                >
                  Discard changes
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div >
  );
};

export default Profile;
