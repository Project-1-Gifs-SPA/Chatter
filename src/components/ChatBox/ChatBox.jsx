
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
} from "../../services/chat.service";
import { useParams } from "react-router";
import AppContext from "../../context/AppContext";
import { FaRegSmile } from "react-icons/fa";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { IoDocumentAttachOutline } from "react-icons/io5";


const ChatBox = () => {
	// const messagesEndRef = useRef();
	const { channelId, dmId } = useParams();
	const { user, userData } = useContext(AppContext);

	// const scrollToBottom = () => {
	// 	messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
	// }

	// useEffect(()=> scrollToBottom, [messages]);
	const [isPickerVisible, setPickerVisible] = useState(false);
	const [msg, setMsg] = useState("");
	const [messages, setMessages] = useState([]);
	const [picURL, setPicURL] = useState([]);
	const [showMenu, setShowMenu] = useState(false)

	const scrollToBottom = () => {
		const chat = document.getElementById("chat");
		chat.scrollTop = chat?.scrollHeight;
	};

	const container = useRef(null);

	const scroll = () => {
		const { offsetHeight, scrollHeight, scrollTop } = container.current;
		if (scrollHeight <= scrollTop + offsetHeight + 100) {
			container.current?.scrollTo(0, scrollHeight);
		}
	};

	useEffect(() => {
		scroll();
	}, [messages]);


	useEffect(() => {
		console.log("live msg");
		if (channelId) {
			getChat(channelId)
				.then((response) => setMessages(Object.values(response)))
				.then(() => scrollToBottom());
		}
		if (dmId) {
			getDMChat(dmId)
				.then((response) => setMessages(Object.values(response)))
				.then(() => scrollToBottom())
		}
	}, [channelId, dmId]);

	useEffect(() => {
		console.log("live msg");

		if (channelId) {
			const unsubscribe = getLiveMessages((snapshot) => {
				setMessages(Object.values(snapshot.val()));
			}, channelId);

			return () => unsubscribe;
		}
		if (dmId) {
			const unsubscribe = getLiveDirectMessages((snapshot) => {
				setMessages(Object.values(snapshot.val()));
			}, dmId);

			return () => unsubscribe;
		}
	}, [channelId, dmId]);

	const handleMsg = (e) => {
		e.preventDefault();

		if (channelId) {
			sendMessage(channelId, userData.handle, msg, userData.photoURL)
				.then(() => setMsg(""));
		}

		if (dmId) {
			sendDirectMessage(dmId, userData.handle, msg, userData.photoURL)
				.then(() => setMsg(''));
		}
	};


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
						<Message key={message.id} message={message} channelId={channelId} dmId={dmId} />
					))
					: null}
			</div>

			{channelId || dmId ?
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
								<IoDocumentAttachOutline className='w-6 h-6 text-white cursor-pointer' />
								{/* <input className='upl hidden' id='pic' type='file' onChange={addImage} /> */}
							</label>
						</div>
					</div>
				</div> : null}


		</div>
	);
};

export default ChatBox;
