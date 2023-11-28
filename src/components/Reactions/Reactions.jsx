import React, { useContext } from 'react'
import { reactions } from '../../common/constants'
import AppContext from '../../context/AppContext'
import { useParams } from 'react-router';
import { addChannelReaction, removeChannelReaction } from '../../services/channel.service';
import { addDmReaction, removeDMReaction } from '../../services/dms.service';

const Reactions = ({ msg, reaction, count }) => {
	const { userData } = useContext(AppContext);
	const { channelId, dmId } = useParams();
	const hasUserReacted = Object.keys(msg.reactions[reaction]).includes(userData.handle);

	const handleClick = () => {
		if (hasUserReacted) {
			if (channelId) {
				removeChannelReaction(reaction, userData.handle, channelId, msg.id);
			}
			if (dmId) {
				removeDMReaction(reaction, userData.handle, dmId, msg.id);
			}
		} else {
			if (channelId) {
				addChannelReaction(reaction, userData.handle, channelId, msg.id);
			}
			if (dmId) {
				addDmReaction(reaction, userData.handle, dmId, msg.id);
			}
		}
	}
	return (
		<div className={`badge m-1 bg-gray-600 p-1 w-9 flex border-gray-700 cursor-pointer ${hasUserReacted && 'border-2 border-indigo-600'}`} onClick={handleClick}>
			<p className='ml-1'>{reactions[reaction]}</p>
			<p className='text-gray-300 ml-1 mr-1'>{count}</p>
		</div>
	)
}

export default Reactions
