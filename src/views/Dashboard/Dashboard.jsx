import React, { useState } from 'react'
import SearchBar from '../../components/SearchBar/SearchBar'

const Dashboard = () => {

	const [show, setShow] = useState('online')

	return (
		<div className='bg-gray-700 w-full'>
			<div className="bg-gray-800 w-[1000px] h-[100vh] py-4 px-4 mx-auto">
				<div className="flex flex-col lg:flex-row lg:items-center gap-4">
					<p className="text-white mb-4 lg:mb-0 ml-4">Friends</p>
					<div className="flex items-center lg:ml-4">
						<button className="btn btn-xs btn-neutral" onClick={() => setShow('online')}>Online</button>
						<button className="btn btn-xs ml-4 btn-neutral" onClick={() => setShow('all')}>All</button>
						<button className="btn btn-xs ml-4 btn-neutral" onClick={() => setShow('requests')}>Friend Requests</button>
						<div className='ml-4 h-[25px] border-l border-gray-500'></div>
						<button className="btn btn-xs ml-4 btn-neutral" onClick={() => setShow('meetings')}>Meetings</button>
					</div>
				</div>
				<div className="lg:mt-0 w-[full]">
					<SearchBar />
				</div>

				<div>
					{show === 'online' ? <p>online friends</p> : null}
					{show === 'all' ? <p> all friends</p> : null}
					{show === 'requests' ? <p> friends request</p> : null}
					{show === 'meetings' ? <p> meetings</p> : null}
				</div>
			</div>
		</div>
	)
}

export default Dashboard