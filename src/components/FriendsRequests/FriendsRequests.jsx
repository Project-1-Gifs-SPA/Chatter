import React, { useContext, useEffect, useState } from 'react'
import TeamMember from '../TeamMember/TeamMember'
import AppContext from '../../context/AppContext'
import { addFriends, declineFriendRequest, getUserByHandle } from '../../services/users.service';

const FriendsRequests = ({ friendsRequests, onClose }) => {
	const { userData } = useContext(AppContext);
	const [requests, setRequests] = useState([])

	useEffect(() => {
		const handleClickOutside = (event) => {
			const modal = document.getElementById('myModal');
			if (modal && !modal.contains(event.target)) {
				onClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [onClose]);

	useEffect(() => {
		if (friendsRequests) {
			const promises = Object.keys(friendsRequests).map(request => {
				return getUserByHandle(request)
					.then((snapshot) => {
						return snapshot.val();
					});
			});

			Promise.all(promises)
				.then((membersData) => {
					setRequests(membersData);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [friendsRequests])

	const handleAcceptRequest = (handle) => {
		addFriends(userData.handle, handle)
	}

	const handleDeclineRequest = (handle) => {
		declineFriendRequest(userData.handle, handle)
	}
	console.log(requests)
	//
	return (
		<div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
			<div id='myModal' className='w-[350px] flex flex-col'>
				<div className='bg-gray-900 p-2 rounded-xl h-[400px]'>
					{requests.length > 0 ? requests.map(friendRequest => {
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