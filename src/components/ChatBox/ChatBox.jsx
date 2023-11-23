import React from 'react'
import Message from '../Message/Message'
import ChatTopBar from '../ChatTopBar/ChatTopBar'
import bg from '../../assets/background.png'
import './ChatBox.css'

const ChatBox = () => {
	return (
		<div className="flex-1 flex flex-col h-screen bg-gray-700 overflow-hidden"
		>
			{/* Top bar */}
			<ChatTopBar />
			{/* <!-- Chat messages --> */}
			<div className="px-6 py-4 flex-1 overflow-y-scroll custom-scrollbar">
				<Message />
				<Message />
			</div>
		</div>
	)
}

export default ChatBox;
