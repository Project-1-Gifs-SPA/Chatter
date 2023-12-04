import React from 'react'
import SearchBar from '../../components/SearchBar/SearchBar'

const Dashboard = () => {
	return (
		<div className='bg-gray-700 w-full'>
			<div className="bg-gray-700 w-[1000px] h-[100vh] py-4 mx-auto">
				<div className="flex absolute lg:flex-row lg:items-center lg:justify-between gap-4">
					<div className="flex items-center">
						<p className="text-white mb-4 lg:mb-0 ml-4">Friends</p>
						<div className="lg:ml-4">
							<button className="btn btn-xs btn-neutral">Online</button>
							<button className="btn btn-xs ml-4 btn-neutral">All</button>
							<button className="btn btn-xs ml-4 btn-neutral">Friend Requests</button>
							<button className="btn btn-xs ml-4 btn-neutral">Meetings</button>
						</div>
					</div>
					
				</div>
				<div className="lg:mt-0 w-[550px]">
						<SearchBar />
					</div>
			
			</div>
		</div>
	)
}

export default Dashboard