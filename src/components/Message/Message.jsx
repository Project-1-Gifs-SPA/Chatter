import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useContext, useEffect, useState } from 'react';
import { FaRegEdit, FaRegSmile } from "react-icons/fa";
import AppContext from '../../context/AppContext';
import { addChannelMsgStatusEdited, editChannelMessage } from '../../services/channel.service';
import { addDMstatusEdited, editDMmessage } from '../../services/dms.service';
import { getLiveUserInfo } from '../../services/users.service';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { MIN_MESSAGE_LENGTH } from '../../common/constants';
import MessageReactions from '../MessageReactions/MessageReactions';
import Reactions from '../Reactions/Reactions';
import moment from 'moment';

const Message = ({ message }) => {

  const { user, userData } = useContext(AppContext);

  const { channelId, dmId } = useParams();

  const [ownerPic, setOwnerPic] = useState('');
  const [showPic, setShowPic] = useState(false);

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message.body);
  const [ariaLabel, setAriaLabel] = useState(`chat bubble from ${message.owner===userData.handle? 'you' : message.owner} that reads ${message.body}`);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modal = document.getElementById('myModal');
      if (modal && !modal.contains(event.target)) {
        setShowPic(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowPic]);

  useEffect(() => {
    getLiveUserInfo(user => setOwnerPic(user.photoURL), message.owner);
  }, [user]);

  const hOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  const dOptions = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  const handleSaveChanges = () => {
    if (editedMessage.length < MIN_MESSAGE_LENGTH) {
      toast.error('Cannot send empty message!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      throw new Error('Cannot send empty message!');
    }

    if (channelId) {
      editChannelMessage(editedMessage, channelId, message.id);
      addChannelMsgStatusEdited(channelId, message.id);
    }

    if (dmId) {
      editDMmessage(editedMessage, dmId, message.id);
      addDMstatusEdited(dmId, message.id);
    }

    setIsEditing(false);
  };

  const handleDiscardChanges = () => {
    setEditedMessage(message.body);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setEditedMessage(e.target.value);
  };

  return (<>
    <div className={`${userData.handle == message.owner ? "chat chat-end mb-1" : "chat chat-start mb-1"} ${message.reactions && 'mb-5'}`} aria-label={ariaLabel}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS chat bubble component" src={ownerPic} className="w-10 h-10 rounded-3xl mr-3"/>
        </div>
      </div>
      <div className="chat-header flex items-center mb-1">
        <span className='font-bold text-[13pt] text-red-300 hover:underline'>{message.owner}</span>
        <time className="text-[8pt] font-bold text-gray-400 pl-2">{(new Date(message.createdOn)).toLocaleTimeString('en-US', hOptions)}</time>
        <div className='flex items-center'>
          {userData.handle === message.owner &&
            <div className="tooltip tooltip-top" data-tip='Edit message'>
              <FaRegEdit className='ml-2 text-[13px] text-gray-400 cursor-pointer' onClick={handleEditClick} />
            </div>
          }
          <MessageReactions msg={message} />
        </div>
      </div>
      <div className="chat-bubble">
        {isEditing ? (
          <div>
            <div>
              <textarea
                type="text"
                className='textarea textarea-info textarea-md max-w-[800px] bg-gray-700 border-none-active px-4 py-2 text-white rounded-md xs:w-[30%] sm:w-[50%] md:w-[70%] lg:w-[90%] xl:w-[800px]'
                value={editedMessage}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key == "Enter" ? handleSaveChanges() : null}
                autoFocus
              />
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  color: 'white',
                }} className='btn btn-xs rounded-full pl-3' onClick={() => setPickerVisible(!isPickerVisible)}>
                <FaRegSmile className="w-6 h-6" />
              </button>
              <div className="inline-block pr-5">
                <div className={`absolute z-10 ${isPickerVisible ? '' : 'hidden'} mt-2`}
                  style={{
                    bottom: '60px',
                    left: 'auto',
                    right: '0'
                  }}>
                  <Picker
                    data={data} previewPosition='none' onEmojiSelect={(e) => {
                      setPickerVisible(!isPickerVisible);
                      setEditedMessage(editedMessage + e.native);
                    }} />
                </div>
              </div>
              <div className='flex'>
                <p className='text-sm text-green-500 mr-5 cursor-pointer' style={{ fontWeight: 'bold' }} onClick={handleSaveChanges}>Save</p>
                <p className='text-sm text-red-500 cursor-pointer' style={{ fontWeight: 'bold' }} onClick={handleDiscardChanges}>Discard</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className='grid'>
              <div className=' text-left tooltip tooltip-top' data-tip={(new Date(message.createdOn)).toLocaleDateString('en-US', dOptions).split(',')[0]}>
                {message.body}
              </div>
              {message.pic &&
                <div className='w-[400px] tooltip tooltip-top' data-tip={(new Date(message.createdOn)).toLocaleDateString('en-US', dOptions).split(',')[0]}>
                  <img src={message.pic} onClick={() => setShowPic(true)} />
                </div>}
            </div>
            {message.edited && <div className="chat-footer text-[7pt] text-gray-400 flex items-center">
              (edited)
            </div>}
            {<div className={`absolute flex ${message.owner === userData.handle && 'right-2'}`}>
              {message.reactions && Object.keys(message.reactions).map((reaction, i) => {
                return <Reactions key={i} msg={message} reaction={reaction} count={Object.keys(message.reactions[reaction]).length} />
              })}
            </div>
            }
          </>
        )}
      </div >
      {showPic && <div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
        <div id='myModal' className='w-[1000px] flex flex-col'>
          <img src={message.pic} />
        </div>
      </div>}
    </div>
  </>
  );
};

export default Message;
