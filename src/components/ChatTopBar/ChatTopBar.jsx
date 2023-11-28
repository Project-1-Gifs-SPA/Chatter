import React, { useContext, useEffect, useState } from 'react'
import TeamSidebar from '../TeamSidebar/TeamSidebar'
import { useParams } from 'react-router'
import { getChannelById } from '../../services/channel.service';
import AppContext from '../../context/AppContext';
import { getDMbyId } from '../../services/dms.service';

const ChatTopBar = () => {
	const { channelId, dmId } = useParams();
	const { userData } = useContext(AppContext)
	const [channelName, setChannelName] = useState('');
	const [dm, setDM] = useState([]);
	const [members, setMembers] = useState('')

	useEffect(() => {
		if (channelId) {
			getChannelById(channelId)
				.then((channel) => setChannelName(channel.name))
		}
		if (dmId) {
			getDMbyId(dmId)
				.then((dm) => {
					setMembers(Object.keys(dm.members).filter(member => member !== userData.handle))
				})
		}
	}, [channelId, dmId])

	return (<>
		<div className="border-b border-gray-600 flex px-6 py-2 items-center justify-between shadow-xl">
			<div className="flex flex-col">
				{/* <h3>Hard coded</h3> */}
				{channelId &&
					<h3 className="text-white mb-1 font-bold text-xl text-gray-100">
						<span className="text-gray-400">#</span> {channelName}
					</h3>
				}
				{dmId &&
					<h3 className="text-white mb-1 font-bold text-xl text-gray-100">
						{members.length > 1 ? members.join(', ') : members}
					</h3>
				}
			</div>
		</div >
	</>
	)
}

export default ChatTopBar