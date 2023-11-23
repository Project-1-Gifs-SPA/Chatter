import React from 'react'
import Message from '../Message/Message'
import ChatTopBar from '../ChatTopBar/ChatTopBar'
import bg from '../../assets/background.png'

const ChatBox = () => {
	return (
		<div className="flex-1 flex flex-col bg-gray-700 overflow-hidden"
		>
			{/* Top bar */}
			<ChatTopBar />
			{/* <!-- Chat messages --> */}
			<div className="px-6 py-4 flex-1 overflow-y-scroll">
				<Message />
				<Message />
			</div>
		</div>
	)
}

export default ChatBox;
