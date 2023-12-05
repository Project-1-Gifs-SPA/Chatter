
import React, { useState, useRef, useEffect, useContext } from "react";
import Message from "../Message/Message";
import ChatTopBar from "../ChatTopBar/ChatTopBar";
import bg from "../../assets/background.png";
import { set } from "firebase/database";
import {
	getChat,
	getDMChat,
	getLiveDirectMessages,
	getLiveMessages,
	sendDirectMessage,
	sendMessage,
	sendPictureDirectMessage,
	sendPictureMessage,
	setChannelSeenBy,
	setNotSeenChannel,
} from "../../services/chat.service";
import { useParams } from "react-router";
import AppContext from "../../context/AppContext";
import { FaRegSmile } from "react-icons/fa";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { IoDocumentAttachOutline } from "react-icons/io5";
import { setDmSeenBy, setNotSeenDm } from "../../services/dms.service";
import { uploadMessagePhoto } from "../../services/storage.service";
import { SlPicture } from "react-icons/sl";


const ChatBox = () => {
	// const messagesEndRef = useRef();
	const { channelId, dmId, teamId } = useParams();
	const { user, userData } = useContext(AppContext);

	// const scrollToBottom = () => {
	// 	messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
	// }

	// useEffect(()=> scrollToBottom, [messages]);
	const [isPickerVisible, setPickerVisible] = useState(false);
	const [msg, setMsg] = useState("");
	const [messages, setMessages] = useState([]);
	const [picURL, setPicURL] = useState('');
	const [showMenu, setShowMenu] = useState(false);
	const [currentChannelId, setCurrentChannelId] = useState('')
	const [pic, setPic] = useState({});


	const container = useRef(null);

	useEffect(() => {
		setCurrentChannelId(channelId)
	}, [channelId])

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
		setChannelSeenBy(channelId, userData.handle);
		setDmSeenBy(dmId, userData.handle);
		//setNotSeenChannel(currentChannelId, teamId)
	}, [messages]);


	useEffect(() => {
		if (currentChannelId) {

			getChat(currentChannelId)
				.then((response) => {
					setMessages(Object.values(response))
				})
				.then(() => scrollToBottom());

		}
		if (dmId) {
			getDMChat(dmId)
				.then((response) => setMessages(Object.values(response)))
				.then(() => scrollToBottom())
		}
	}, [currentChannelId, dmId]);

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
	}, [currentChannelId, dmId]);

	const handleMsg = (e) => {
		console.log('msg handle')
		e.preventDefault();

		if (picURL && channelId){
			console.log('pic handling')
			sendPictureMessage(channelId, userData.handle, msg, picURL)
			.then(()=> {			
				setShowMenu(false);
				setPicURL('')
				setMsg('')
				return;
				})
		}

		
		if (picURL && dmId){
			console.log('pic handling')
			sendPictureDirectMessage(dmId, userData.handle, msg, picURL)
			.then(()=> {			
				setShowMenu(false);
				setPicURL('')
				setMsg('')
				})
		}

		if (currentChannelId && msg && !picURL) {
			sendMessage(currentChannelId, userData.handle, msg, userData.photoURL)
				.then(() => setMsg(""))
				.then(() => setNotSeenChannel(currentChannelId, teamId))
		}

		if (dmId && msg && !picURL) {
			sendDirectMessage(dmId, userData.handle, msg, userData.photoURL)
				.then(() => setMsg(''))
				.then(() => setNotSeenDm(dmId, teamId))
		}
	};


	const handlePic = (e) => {
		e.preventDefault();
		if (e.target.files[0] !== null) {
			const file = e.target.files[0];
			uploadMessagePhoto( photoURL=>{
				
				setPicURL(photoURL);
				setShowMenu(true);	
				
			},file)
			// setMsg(e.target.files[0].name)
			console.log(pic);
		}
	}

	return (
		<div className="flex-1 flex flex-col bg-gray-700">
			{/* Top bar */}
			<ChatTopBar />
			{/* <!-- Chat messages --> */}
			<div
				ref={container}
				className="px-6 py-4 flex-1 overflow-y-scroll"
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
			{showMenu &&<div className='p-3 m-3 flex justify-between rounded'>
  							<img src={picURL} alt='pic' className="w-[200px] h-auto ml-2" />
  							<p className="cursor-pointer" onClick={()=>{setShowMenu(false); setPicURL('')}}>X</p>
							</div>}
			{currentChannelId || dmId ?
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
							<input
								className="bg-gray-800 border-none rounded"
								style={{ padding: "10px 20px", width: "100%", outline: 'none' }}
								type="text"
								value={msg}
								placeholder={`Type something...`}
								onChange={(e) => setMsg(e.target.value)}
							/>

							{/* <button type='submit' className='ml-50'>Send</button> */}
						
							<input className='upl hidden' id='pic' type='file'  accept="image/jpeg, image/png, image/jpg" onChange={handlePic}/>
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
						</div>
					</div>
				</div> : null}
		</div>
	);
};

export default ChatBox;
