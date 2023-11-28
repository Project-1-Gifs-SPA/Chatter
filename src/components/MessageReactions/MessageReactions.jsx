import React from 'react'
import { reactions } from '../../common/constants'
import { BsEmojiSmile } from "react-icons/bs";
import { useParams } from 'react-router';

const MessageReactions = ({ message }) => {
	const { channelId, dmId } = useParams();

	return (<>
		<div className='dropdown dropdown-hover dropdown-top'>
			<label tabIndex={0} ><BsEmojiSmile className='text-gray-500 cursor-pointer text-sm ml-2' /></label>
			<ul className="dropdown-content z-1000 menu-horizontal shadow bg-gray-600 rounded-box p-1" tabIndex={0}
				style={{
					position: 'absolute',
					bottom: '12px',
					right: '0px',
				}}>
				<li>
					<a className="tooltip text-[22px]" data-tip="Like">
						{reactions.like}
					</a>
				</li>
				<li>
					<a className="tooltip text-[22px]" data-tip="Love">
						{reactions.love}
					</a>
				</li>
				<li>
					<a className="tooltip text-[22px]" data-tip="Haha">
						{reactions.haha}
					</a>
				</li>
				<li>
					<a className="tooltip text-[22px]" data-tip="Wow">
						{reactions.wow}
					</a>
				</li>
				<li>
					<a className="tooltip text-[22px]" data-tip="Sad">
						{reactions.sad}
					</a>
				</li>
				<li>
					<a className="tooltip text-[22px]" data-tip="Angry">
						{reactions.angry}
					</a>
				</li>
			</ul >
		</div>
	</>
	)
}

export default MessageReactions