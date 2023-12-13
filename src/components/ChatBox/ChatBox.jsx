
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useContext, useEffect, useRef, useState } from "react";
import { FaRegSmile, FaTrashAlt } from "react-icons/fa";
import { SlPicture } from "react-icons/sl";
import { useParams } from "react-router";
import AppContext from "../../context/AppContext";
import {
  getChat,
  getDMChat,
  getLiveDirectMessages,
  getLiveMeetingMessages,
  getLiveMessages,
  getMeetingChat,
  sendDirectMessage,
  sendMeetingMessage,
  sendMeetingPictureMessage,
  sendMessage,
  sendPictureDirectMessage,
  sendPictureMessage,
  setChannelSeenBy,
  setNotSeenChannel,
} from "../../services/chat.service";
import { setDmSeenBy, setNotSeenDm } from "../../services/dms.service";
import { uploadMessagePhoto } from "../../services/storage.service";
import ChatTopBar from "../ChatTopBar/ChatTopBar";
import Giphy from "../Giphy/Giphy";
import Message from "../Message/Message";
import './ChatBox.css';

import { HiOutlineGif } from "react-icons/hi2";
import { getSearchGifs } from "../../services/giphy.service";

const ChatBox = () => {

  const { channelId, dmId, meetingId, teamId } = useParams();
  const { userData } = useContext(AppContext);

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [picURL, setPicURL] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [currentChannelId, setCurrentChannelId] = useState('')
  const [pic, setPic] = useState({});
  const [giphy, setGiphy] = useState(false);
  const [gifQuery, setGifQuery] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [gifResults, setGifResults] = useState([]);
  const [gifOption, setGifOption] = useState(false);

  const container = useRef(null);

  useEffect(() => {
    setCurrentChannelId(channelId);
  }, [channelId]);

  const scrollToBottom = () => {
    const chat = document.getElementById("chat");
    chat.scrollTop = chat?.scrollHeight;
  };

  const scroll = () => {
    const { offsetHeight, scrollHeight, scrollTop } = container.current;

    if (scrollHeight <= scrollTop + offsetHeight + 100) {
      container.current?.scrollTo(0, scrollHeight);
    }
  };

  useEffect(() => {

    scroll();

    if (currentChannelId) {
      setChannelSeenBy(currentChannelId, userData.handle);
    }

    if (dmId) {
      setDmSeenBy(dmId, userData.handle);
    }
  }, [messages]);

  useEffect(() => {
    if (currentChannelId) {
      getChat(currentChannelId)
        .then((response) => {
          setMessages(Object.values(response))
        })
        .then(() => scrollToBottom())
        .catch((e) => console.error(e));
    }

    if (dmId) {
      getDMChat(dmId)
        .then((response) => setMessages(Object.values(response)))
        .then(() => scrollToBottom())
        .catch((e) => console.error(e));
    }

    if (meetingId) {
      getMeetingChat(meetingId)
        .then((response) => setMessages(Object.values(response)))
        .then(() => scrollToBottom())
        .catch((e) => console.error(e));
    }
  }, [currentChannelId, dmId, meetingId]);

  useEffect(() => {
    if (currentChannelId) {
      const unsubscribe = getLiveMessages((snapshot) => {
        const msgData = snapshot.exists() ? snapshot.val() : {};
        setMessages(Object.values(msgData));
      }, currentChannelId);

      return () => unsubscribe();
    }

    if (dmId) {
      const unsubscribe = getLiveDirectMessages((snapshot) => {
        const msgData = snapshot.exists() ? snapshot.val() : {};
        setMessages(Object.values(msgData));
      }, dmId);

      return () => unsubscribe();
    }

    if (meetingId) {
      const unsubscribe = getLiveMeetingMessages(snapshot => {
        const msgData = snapshot.exists() ? snapshot.val() : {};
        setMessages(Object.values(msgData));
      }, meetingId);

      return () => unsubscribe;
    }
  }, [currentChannelId, dmId, meetingId]);


  const handleMsg = (e) => {
    e.preventDefault();

    if (!msg.trim() && !picURL) { return; }

    if (picURL && channelId) {
      sendPictureMessage(channelId, userData.handle, msg, picURL)
        .then(() => {
          setShowMenu(false);
          setPicURL('');
          setMsg('');
          return;
        })
        .catch((e) => console.error(e));
    }

    if (picURL && dmId) {
      sendPictureDirectMessage(dmId, userData.handle, msg, picURL)
        .then(() => {
          setShowMenu(false);
          setPicURL('');
          setMsg('');
        })
        .catch((e) => console.error(e));
    }

    if (channelId && msg && !picURL) {
      sendMessage(currentChannelId, userData.handle, msg, userData.photoURL)
        .then(() => setNotSeenChannel(channelId, teamId))
        .then(() => setMsg(""))
        .catch((e) => console.error(e));
    }

    if (dmId && msg && !picURL) {
      sendDirectMessage(dmId, userData.handle, msg, userData.photoURL)
        .then(() => setNotSeenDm(dmId))
        .then(() => setMsg(''))
        .catch((e) => console.error(e));
    }

    if (meetingId && msg && !picURL) {
      sendMeetingMessage(meetingId, userData.handle, msg, userData.photoURL)
        .then(() => setMsg(''))
        .catch((e) => console.error(e));
    }

    if (meetingId && picURL) {
      sendMeetingPictureMessage(meetingId, userData.handle, msg, picURL)
        .then(() => {
          setShowMenu(false);
          setPicURL('');
          setMsg('');
        })
        .catch((e) => console.error(e));
    }

    scrollToBottom();
  };

  const handlePic = (e) => {
    e.preventDefault();

    if (e.target.files[0] !== null) {
      const file = e.target.files[0];
      uploadMessagePhoto(photoURL => {
        setPicURL(photoURL);
        setPic({});
        setShowMenu(true);
      }, file);
      // setMsg(e.target.files[0].name)
    }
  }

  useEffect(() => {
    if (picURL && giphy) {
      setGiphy(false);
      setShowMenu(true);
    }

    if (picURL && gifResults) {
      setGifResults([]);
      setGifQuery(false)
      setShowMenu(true)
      setSearchTerm('');
    }
  }, [picURL]);

  useEffect(() => {
    if (msg === '/gif') {
      setGifOption(true);
    }
  }, [msg]);

  useEffect(() => {
    if (searchTerm) {
      getSearchGifs(searchTerm)
        .then(data => setGifResults(data))
        .catch((e) => console.error(e));
    }
  }, [searchTerm]);

  return (
    <div className="flex-1 flex flex-col bg-gray-700">
      {/* Top bar */}
      <ChatTopBar />
      {/* <!-- Chat messages --> */}
      <div
        ref={container}
        className="px-6 py-4 flex-1 overflow-y-scroll custom-scrollbar"
        id="chat"
      >
        {/* <Message />
				<Message /> */}
        {messages.length
          ? messages.map((message) => (
            <Message key={message.id} message={message} channelId={currentChannelId} dmId={dmId} />
          ))
          : null}
      </div>

      {showMenu && <div className='p-3 mx-4 flex rounded w-[95%] bg-gray-800 bg-opacity-60'>
        <img src={picURL} alt='pic' className="w-[200px] h-auto ml-2" />
        <p className="cursor-pointer ml-2" onClick={() => { setShowMenu(false); setPicURL('') }}>
          <FaTrashAlt className='text-red-600' />
        </p>
      </div>}
      {gifResults.length !== 0 && <div className='p-3 mx-4 flex rounded w-[95%] bg-gray-800 bg-opacity-60'>
        {gifResults.map(gif => <div key={gif.id}> <img src={gif.images.downsized.url} alt='pic' className="w-[200px] h-auto ml-2" onClick={() => setPicURL(gif.images.downsized.url)} /></div>)}
      </div>}

      {gifOption && <div className='p-3 mx-4 flex rounded w-[95%] bg-gray-800 bg-opacity-60'>
        <p className="cursor-pointer ml-2 hover:bg-gray-900" onClick={() => { setGifQuery(true); setMsg(''); setGifOption(false) }}>
          /gif Query - search your favorite gifs
        </p>
      </div>}

      {giphy && <div className="absolute bottom-[55px] right-[100px] mt-[-38px] pr-5"><Giphy setPicURL={setPicURL} /></div>}

      {currentChannelId || dmId || meetingId ?

        <div className='flex items-center bg-gray-800 rounded-md ml-4 mb-4' style={{ width: "95%", outline: 'none' }}>
          <div className='flex-grow'>
            <form
              style={{
                backgroundColor: "gray 900",
                color: "white",
                border: "none",
                padding: "2px 20px",
              }}
              onSubmit={handleMsg}
            >
              <div className="flex" style={{ padding: "10px 20px", width: "100%", outline: 'none' }} >
                {!gifQuery ?
                  <input
                    className="bg-gray-800 border-none rounded"
                    style={{ padding: "10px 20px", width: "100%", outline: 'none' }} //10px 20px
                    type="text"
                    value={msg}
                    placeholder={`Type something...`}
                    onChange={(e) => setMsg(e.target.value)}
                  />
                  :
                  <div className="flex">
                    <span className="mr-1" onClick={() => { setGifQuery(false); setGifResults([]); }}>/gif query </span>
                    <input className="active"
                      style={{ padding: "10px 20px", width: "50%", height: "70%", outline: 'none' }}
                      value={searchTerm} placeholder="search" onChange={e => setSearchTerm(e.target.value)}
                      autoFocus
                    ></input>
                  </div>}
              </div>

              <input className='upl hidden' id='pic' type='file' accept="image/jpeg, image/png, image/jpg" onChange={handlePic} />
            </form>

          </div>
          <div className="relative inline-block pr-5">
            <div className={`absolute z-10 ${isPickerVisible ? '' : 'hidden'} mt-2`}
              style={{
                bottom: '42px',
                left: 'auto',
                right: '0'
              }}>
              <Picker
                data={data} previewPosition='none' onEmojiSelect={(e) => {
                  setPickerVisible(!isPickerVisible);
                  setMsg(msg + e.native);
                }} />
            </div>
            <div className="flex items-center justify-between">
              <button style={{
                //transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                color: 'white',
              }} className='btn btn-xs rounded-full' onClick={() => setPickerVisible(!isPickerVisible)}>
                <FaRegSmile className="w-6 h-6" />
              </button>
              <label style={{
                //transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                color: 'white',
              }}
                htmlFor='pic'>
                <SlPicture className='w-6 h-6 text-white cursor-pointer' />

              </label>
              <label style={{
                //transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                color: 'white',
              }} className='btn btn-xs rounded-full' onClick={() => setGiphy(!giphy)}>
                <HiOutlineGif className='w-6 h-6 text-white cursor-pointer' />
              </label>
            </div>

          </div>
        </div> : null}
    </div>
  );
};

export default ChatBox;
