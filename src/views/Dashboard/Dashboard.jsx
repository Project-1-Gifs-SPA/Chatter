import React, { useState } from 'react'
import SearchBar from '../../components/SearchBar/SearchBar'
import OnlineFriends from '../../components/OnlineFriends/OnlineFriends'
import AllFriends from '../../components/AllFriends/AllFriends'
import FriendsRequests from '../../components/FriendsRequests/FriendsRequests'
import FriendsRequestsDashboard from '../../components/FriendsRequestsDashboard/FriendsRequestsDashboard'
import MeetingSideBar from '../../components/MeeetingSideBar/MeetingSideBar'

const Dashboard = () => {

	const [show, setShow] = useState('online')

	return (
		<>
		<div className='bg-gray-700 w-full'>
			{/* <div className="bg-gray-800 w-[1000px] h-[100vh] pt-5 px-4 mx-auto"> */}
				<div className="border-b border-gray-600 flex px-6 py-3 items-center justify-between shadow-xl">
					<p className="text-white mb-4 lg:mb-0 ml-4 mr-6">Friends</p>
					<div className="flex mr-auto">
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
					{show === 'online' ? <OnlineFriends /> : null}
					{show === 'all' ? <AllFriends /> : null}
					{show === 'requests' ? <FriendsRequestsDashboard /> : null}
					{show === 'meetings' ? <p> meetings</p> : null}
				</div>
				


			{/* </div> */}
		</div>
		<MeetingSideBar />
		</>
	)
}

export default Dashboard