import React from 'react'
import TeamSidebar from '../TeamSidebar/TeamSidebar'

const ChatTopBar = () => {
	return (<>
		<div className="border-b border-gray-600 flex px-6 py-2 items-center justify-between shadow-xl">
			<div className="flex flex-col">
				<h3 className="text-white mb-1 font-bold text-xl text-gray-100">
					<span className="text-gray-400">#</span> Team name / dm member
				</h3>
			</div>
		</div>
	</>
	)
}

export default ChatTopBar