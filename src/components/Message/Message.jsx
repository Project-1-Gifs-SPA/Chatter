import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../context/AppContext'
import { getLiveUserInfo } from '../../services/users.service';

const Message = ({ message }) => {

	const { userData } = useContext(AppContext);
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

	return (
		<div className={userData.handle == message.owner ? "chat chat-end" : "chat chat-start"}>
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img alt="Tailwind CSS chat bubble component" src={message.avatar} className="cursor-pointer w-10 h-10 rounded-3xl mr-3" />
				</div>
			</div>
			<div className="chat-header">

				<span className='font-bold text-[13pt] text-red-300 cursor-pointer hover:underline'>{message.owner}</span>
				<time className="text-[8pt] font-bold text-gray-400 pl-2">{(new Date(message.createdOn)).toLocaleTimeString('en-US', hOptions)}</time>
			</div>
			<div className="chat-bubble">
				<div className='tooltip tooltip-top' data-tip={(new Date(message.createdOn)).toLocaleDateString('en-US', dOptions).split(',')[0]}>
					{message.body}
				</div>
			</div>
			<div className="chat-footer text-gray-400">
				Delivered
			</div>

		</div >

	)
}

export default Message