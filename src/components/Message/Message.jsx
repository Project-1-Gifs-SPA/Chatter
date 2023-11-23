import React, { useContext, useState } from 'react'
import AppContext from '../../context/AppContext'

const Message = ({message}) => {

	const {userData} = useContext(AppContext);

	



	return (
		<div className={userData.handle==message.owner? "chat chat-end" :  "chat chat-start"}>
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img alt="Tailwind CSS chat bubble component" src={message.avatar} className="cursor-pointer w-10 h-10 rounded-3xl mr-3" />
				</div>
			</div>
			<div className="chat-header">
				<span className='font-bold text-red-300 cursor-pointer hover:underline'>{message.owner}</span>
				<time className="text-xs font-bold text-gray-400 pl-2">{(new Date(message.createdOn)).toLocaleString()}</time>
			</div>
			<div className="chat-bubble">{message.body}</div>
			<div className="chat-footer text-gray-400">
				Delivered
			</div>
		</div>

	)
}

export default Message