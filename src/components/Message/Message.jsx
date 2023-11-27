import React, { useContext, useEffect, useRef, useState } from 'react'
import AppContext from '../../context/AppContext'
import { getLiveUserInfo } from '../../services/users.service';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FaRegEdit } from "react-icons/fa";
import { Textarea } from 'daisyui';
import { editChannelMessage } from '../../services/channel.service';
import { editDMmessage } from '../../services/dms.service';

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

	const [isOpen, setIsOpen] = useState(false);

	const [isEditing, setIsEditing] = useState(false);
	const [editedMessage, setEditedMessage] = useState(message.body);

	const dropdownRef = useRef(null);

	const handleSaveChanges = () => {
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

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const closeDropdown = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('mousedown', closeDropdown);
		} else {
			document.removeEventListener('mousedown', closeDropdown);
		}

		return () => {
			document.removeEventListener('mousedown', closeDropdown);
		};
	}, [isOpen]);

	const handleEditClick = () => {
		setIsEditing(true);
		setIsOpen(false)
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
			<div className="chat-header flex items-center">

				<span className='font-bold text-[13pt] text-red-300 cursor-pointer hover:underline'>{message.owner}</span>
				<time className="text-[8pt] font-bold text-gray-400 pl-2">{(new Date(message.createdOn)).toLocaleTimeString('en-US', hOptions)}</time>
				{userData.handle === message.owner &&
					<>
						<button
							className="bg-none text-gray-400 pl-2 text-[20pt]"
							type="button"
							id="dropdownMenuButton1"
							data-te-dropdown-toggle-ref
							aria-expanded={isOpen}
							onClick={toggleDropdown}
							data-te-ripple-init
							data-te-ripple-color="light"
						>
							<BiDotsHorizontalRounded />
						</button>
						<div className="relative" data-te-dropdown-ref ref={dropdownRef}>
							<ul
								className={`absolute z-50 float-left m-0 ${isOpen ? 'block' : 'hidden'}  min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700`}
								style={{ right: '0', top: 'calc(100% + 10px)' }}
								aria-labelledby="dropdownMenuButton1"
								data-te-dropdown-menu-ref
							>
								<li>
									<a
										className="block flex items-center w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
										href="#"
										data-te-dropdown-item-ref
										onClick={handleEditClick}
									>
										<FaRegEdit className='mr-2 text-[18px]' /> Edit Message
									</a>
								</li>
								{/* <li>
									<a
										className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
										href="#"
										data-te-dropdown-item-ref
									>
										Another action
									</a>
								</li>
								<li>
									<a
										className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
										href="#"
										data-te-dropdown-item-ref
									>
										Something else here
									</a>
								</li> */}
							</ul>
						</div>
					</>
				}
			</div>
			<div className="chat-bubble">
				{isEditing ? (
					<div>
						<textarea
							type="text"
							className='textarea textarea-accent textarea-md bg-gray-700 border-none-active px-4 py-2 text-white rounded-md w-[800px]'
							value={editedMessage}
							onChange={handleInputChange}
							autoFocus // Autofocus on the input field when editing starts
						/>
						<br />
						<div className='flex'>
							<p className='text-sm text-green-500 mr-5 cursor-pointer' style={{ fontWeight: 'bold' }} onClick={handleSaveChanges}>Save</p>
							<p className='text-sm text-red-500 cursor-pointer' style={{ fontWeight: 'bold' }} onClick={handleDiscardChanges}>Discard</p>
						</div>
					</div>
				) : (
					<div className='tooltip tooltip-top' data-tip={(new Date(message.createdOn)).toLocaleDateString('en-US', dOptions).split(',')[0]}>
						{message.body}
					</div>
				)}
			</div >
			<div className="chat-footer text-gray-400">
				Delivered
			</div>
		</div>

	)
}

export default Message