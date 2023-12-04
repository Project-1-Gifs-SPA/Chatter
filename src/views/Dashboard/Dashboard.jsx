import React from 'react'
import SearchBar from '../../components/SearchBar/SearchBar'

const Dashboard = () => {
	return (
		<div className='bg-gray-700 w-full'>
			<div className="bg-gray-800 w-[1100px] h-[100vh] px-4 mx-auto">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
					<div className="flex items-center">
						<p className="text-white mb-4 lg:mb-0 ml-4">Friends</p>
						<div className="lg:ml-4 flex items-center">
							<button className="btn btn-xs btn-neutral">Online</button>
							<button className="btn btn-xs ml-4 btn-neutral">All</button>
							<button className="btn btn-xs ml-4 btn-neutral">Friend Requests</button>
							<div className='ml-4 divider h-[25px] border-l border-gray-500'></div>
							<button className="btn btn-xs ml-4 btn-neutral">Meetings</button>
						</div>
					</div>
					<div className="lg:mt-0 mb-4">
						<SearchBar />
					</div>
				</div>
				<div className='divider'></div>

			</div>
		</div>
	)
}

export default Dashboard