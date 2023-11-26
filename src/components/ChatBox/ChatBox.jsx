
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

const ChatBox = () => {
	// const messagesEndRef = useRef();
	const { channelId, dmId } = useParams();
	const { user, userData } = useContext(AppContext);

	// const scrollToBottom = () => {
	// 	messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
	// }

	// useEffect(()=> scrollToBottom, [messages]);

	const [msg, setMsg] = useState("");
	const [messages, setMessages] = useState([]);

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
						<Message key={message.id} message={message} />
					))
					: null}
			</div>
			{channelId || dmId ? <form
				style={{
					backgroundColor: "gray 900",
					color: "white",
					fontWeight: "bold",
					border: "none",
					padding: "10px 20px",
				}}
				onSubmit={handleMsg}
			>
				<input
					style={{ padding: "10px 20px", width: "100%" }}
					type="text"
					value={msg}
					onChange={(e) => setMsg(e.target.value)}
				/>
				{/* <button type='submit' className='ml-50'>Send</button> */}
			</form> : null}
		</div>
	);
};

export default ChatBox;
