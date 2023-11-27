import React, { useEffect, useState } from 'react'
import TeamSidebar from '../TeamSidebar/TeamSidebar'
import { useParams } from 'react-router'
import { getChannelById } from '../../services/channel.service';

const ChatTopBar = () => {
	const { channelId } = useParams();
	const [channelName, setChannelName] = useState('');

	useEffect(() => {
		if (channelId) {
			getChannelById(channelId)
				.then((channel) => setChannelName(channel.name))
		}
	}, [channelId])

	return (<>
		<div className="border-b border-gray-600 flex px-6 py-2 items-center justify-between shadow-xl">
			<div className="flex flex-col">
				<h3 className="text-white mb-1 font-bold text-xl text-gray-100">
					<span className="text-gray-400">#</span> {channelName}
				</h3>
			</div>
		</div>
	</>
	)
}

export default ChatTopBar