import { useContext } from 'react'
import { reactions } from '../../common/constants'
import { BsEmojiSmile } from "react-icons/bs";
import { useParams } from 'react-router';
import { addChannelReaction } from '../../services/channel.service';
import AppContext from '../../context/AppContext';
import { addDmReaction } from '../../services/dms.service';

const MessageReactions = ({ msg }) => {
	const { channelId, dmId } = useParams();
	const { userData } = useContext(AppContext);
	const reactionWords = Object.keys(reactions);

	return (<>
		<div className='dropdown dropdown-hover dropdown-top'>
			<label tabIndex={0} >
				<BsEmojiSmile className='text-gray-400 cursor-pointer text-[13px] ml-2' />
			</label>
			<ul className="dropdown-content z-1000 menu-horizontal shadow bg-gray-600 rounded-box p-1" tabIndex={0}
				style={{
					position: 'absolute',
					bottom: '12px',
					right: '0px',
				}}>
				{Object.keys(reactions).map((reaction, i) => {
					return (
						<li key={i}>
							<a className="tooltip text-[22px] cursor-pointer" data-tip={reactionWords[i]}
								onClick={() => {
									if (channelId) {
										addChannelReaction(reactionWords[i], userData.handle, channelId, msg.id)
									}
									if (dmId) {
										addDmReaction(reactionWords[i], userData.handle, dmId, msg.id)
									}
								}}>
								{reactions[reaction]}
							</a>
						</li>
					)
				})
				}
			</ul >
		</div>
	</>
	)
}

export default MessageReactions;
