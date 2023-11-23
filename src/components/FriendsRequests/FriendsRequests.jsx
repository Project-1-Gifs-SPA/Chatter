import React, { useContext } from 'react'
import TeamMember from '../TeamMember/TeamMember'
import AppContext from '../../context/AppContext'
import { addFriends, declineFriendRequest } from '../../services/users.service';

const FriendsRequests = ({ friendsRequests, onClose }) => {
	const { userData } = useContext(AppContext);

	const handleAcceptRequest = (handle) => {
		addFriends(userData.handle, handle)
	}

	const handleDeclineRequest = (handle) => {
		declineFriendRequest(userData.handle, handle)
	}

	console.log(userData.friendRequests)
	return (
		<div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
			<div className='w-[350px] flex flex-col'>
				<button className='text-white text-xl place-self-end' onClick={() => onClose()}>x</button>
				<div className='bg-gray-900 p-2 rounded-xl h-[400px]'>
					{friendsRequests.length > 0 ? friendsRequests.map(friendRequest => {
						return <div className='flex items-center justify-center mt-5' key={friendRequest.uid}>
							<TeamMember member={friendRequest} owner={null} />
							<p className='pl-5 text-2xl tooltip tooltip-bottom cursor-pointer' data-tip='Accept' onClick={() => handleAcceptRequest(friendRequest.handle)}>✅</p>
							<p className='pl-5 text-2xl tooltip tooltip-bottom cursor-pointer' data-tip='Decline' onClick={() => handleDeclineRequest(friendRequest.handle)}>❌</p>
						</div>
					}) : (<div className='flex justify-center'>
						<p className='text-white text-center mt-20 text-3xl'>
							You do not have friend <br className="md:hidden lg:inline" />requests for now!<br className="md:hidden lg:inline" />
							<span role="img" aria-label="sad face" className="ml-2">
								☹️
							</span>
						</p>
					</div>)
					}
				</div>
			</div>
		</div>
	)
}

export default FriendsRequests