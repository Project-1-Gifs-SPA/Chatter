import React, { useContext, useEffect, useRef, useState } from 'react'
import AppContext from '../../context/AppContext'
import { getLiveUserInfo } from '../../services/users.service';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FaRegEdit } from "react-icons/fa";
import { Textarea } from 'daisyui';
import { editChannelMessage } from '../../services/channel.service';
import { editDMmessage } from '../../services/dms.service';
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { FaRegSmile } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import { toast } from 'react-toastify';
import { MIN_MESSAGE_LENGTH } from '../../common/constants';

const Message = ({ message, channelId, dmId }) => {

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

	const [isPickerVisible, setPickerVisible] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedMessage, setEditedMessage] = useState(message.body);

	const handleSaveChanges = () => {
		if (editedMessage.length < MIN_MESSAGE_LENGTH) {
			toast.error('Cannot send empty message!', {
				position: "top-center",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			})
			throw new Error('Cannot send empty message!')
		}
		if (channelId) {
			editChannelMessage(editedMessage, channelId, message.id);
		}
		if (dmId) {
			editDMmessage(editedMessage, dmId, message.id);
		}

		setIsEditing(false);
	}

	const handleDiscardChanges = () => {
		setEditedMessage(message.body);
		setIsEditing(false);
	}

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleInputChange = (e) => {
		setEditedMessage(e.target.value);
	};

	return (
		<div className={userData.handle == message.owner ? "chat chat-end" : "chat chat-start"}>
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img alt="Tailwind CSS chat bubble component" src={message.avatar} className="cursor-pointer w-10 h-10 rounded-3xl mr-3" />
				</div>
			</div>
			<div className="chat-header flex items-center mb-1">
				<span className='font-bold text-[13pt] text-red-300 cursor-pointer hover:underline'>{message.owner}</span>
				<time className="text-[8pt] font-bold text-gray-400 pl-2">{(new Date(message.createdOn)).toLocaleTimeString('en-US', hOptions)}</time>
				{userData.handle === message.owner &&
					<div className="tooltip tooltip-top" data-tip='Edit message'>
						<FaRegEdit className='ml-2 text-[17px] text-gray-400 cursor-pointer' onClick={handleEditClick} />
					</div>
				}
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
								autoFocus // Autofocus on the input field when editing starts
							/>
							<button
								style={{
									//transform: 'translateY(-50%)',
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
					<div className='tooltip tooltip-top' data-tip={(new Date(message.createdOn)).toLocaleDateString('en-US', dOptions).split(',')[0]}>
						{message.body}
					</div>
				)}
			</div >

			<div className="chat-footer text-gray-400 flex items-center">
				Delivered
			</div>
		</div>

	)
}

export default Message


{/* <div className="tooltip tooltip-top" data-tip='Add reaction'>
						<BsEmojiSmile className='ml-2 text-[17px] text-gray-400 cursor-pointer' />
					</div> */}