import React from 'react'

const Message = () => {
	return (
		<div className="chat chat-start">
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img alt="Tailwind CSS chat bubble component" src="https://cdn.discordapp.com/embed/avatars/4.png" className="cursor-pointer w-10 h-10 rounded-3xl mr-3" />
				</div>
			</div>
			<div className="chat-header">
				<span className='font-bold text-red-300 cursor-pointer hover:underline'>User</span>
				<time className="text-xs font-bold text-gray-400 pl-2">12:45</time>
			</div>
			<div className="chat-bubble">You were the Chosen One!</div>
			<div className="chat-footer text-gray-400">
				Delivered
			</div>
		</div>

	)
}

export default Message