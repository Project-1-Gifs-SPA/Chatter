import React, { useContext, useState } from 'react'
import { reactions } from '../../common/constants'
import { BsEmojiSmile } from "react-icons/bs";
import { useParams } from 'react-router';
import { addChannelReaction } from '../../services/channel.service';
import AppContext from '../../context/AppContext';
import { addDmReaction } from '../../services/dms.service';

const MessageReactions = ({ msg }) => {
	const { channelId, dmId } = useParams();
	const { userData } = useContext(AppContext);
	const reactionWords = Object.keys(reactions)

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
					<a className="tooltip text-[22px] cursor-pointer" data-tip="Like" onClick={() => {
						if (channelId) {
							addChannelReaction(reactionWords[0], userData.handle, channelId, msg.id)
						}
						if (dmId) {
							addDmReaction(reactionWords[0], userData.handle, dmId, msg.id)
						}
					}}>
						{reactions.like}
					</a>
				</li>
				<li>
					<a className="tooltip text-[22px] cursor-pointer" data-tip="Love" onClick={() => {
						if (channelId) {
							addChannelReaction(reactionWords[1], userData.handle, channelId, msg.id)
						}
						if (dmId) {
							addDmReaction(reactionWords[1], userData.handle, dmId, msg.id)
						}
					}}>
						{reactions.love}
					</a>
				</li>
				<li>
					<a className="tooltip text-[22px] cursor-pointer" data-tip="Haha" onClick={() => {
						if (channelId) {
							addChannelReaction(reactionWords[2], userData.handle, channelId, msg.id)
						}
						if (dmId) {
							addDmReaction(reactionWords[2], userData.handle, dmId, msg.id)
						}
					}}>
						{reactions.haha}
					</a>
				</li>
				<li>
					<a className="tooltip text-[22px] cursor-pointer" data-tip="Wow" onClick={() => {
						if (channelId) {
							addChannelReaction(reactionWords[3], userData.handle, channelId, msg.id)
						}
						if (dmId) {
							addDmReaction(reactionWords[3], userData.handle, dmId, msg.id)
						}
					}}>
						{reactions.wow}
					</a>
				</li>
				<li>
					<a className="tooltip text-[22px] cursor-pointer" data-tip="Sad" onClick={() => {
						if (channelId) {
							addChannelReaction(reactionWords[4], userData.handle, channelId, msg.id)
						}
						if (dmId) {
							addDmReaction(reactionWords[4], userData.handle, dmId, msg.id)
						}
					}}>
						{reactions.sad}
					</a>
				</li>
				<li>
					<a className="tooltip text-[22px] cursor-pointer" data-tip="Angry" onClick={() => {
						if (channelId) {
							addChannelReaction(reactionWords[5], userData.handle, channelId, msg.id)
						}
						if (dmId) {
							addDmReaction(reactionWords[5], userData.handle, dmId, msg.id)
						}
					}}>
						{reactions.angry}
					</a>
				</li>
			</ul >
		</div>
	</>
	)
}

export default MessageReactions