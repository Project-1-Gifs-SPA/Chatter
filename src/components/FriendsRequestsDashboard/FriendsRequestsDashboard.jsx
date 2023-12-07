import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import { addFriends, declineFriendRequest, getLiveUserInfo, getUserByHandle } from "../../services/users.service";
import TeamMember from "../TeamMember/TeamMember";


const FriendsRequestsDashboard = () => {


	const { userData } = useContext(AppContext);
	const [requests, setRequests] = useState([])
	const [currentUser, setCurrentUser] = useState({});


	useEffect(() => {
		if (currentUser.friendRequests) {


			console.log(Object.keys(currentUser.friendRequests))
			const promises = Object.keys(currentUser.friendRequests).map(request => {
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
		setRequests([]);
	}, [currentUser.friendRequests])


	useEffect(() => {
		const u = getLiveUserInfo((data) => {
			setCurrentUser(data)
		}, userData?.handle)

		return () => u();

	}, [userData]);


	const handleAcceptRequest = (handle) => {
		addFriends(userData.handle, handle)
	}

	const handleDeclineRequest = (handle) => {
		declineFriendRequest(userData.handle, handle)
	}

	return (

		<div>
			<div className={`flex flex-col ${requests.length ? '' : 'items-center'}`}>
				<div className='flex'>
					{requests.length ? requests.map(friendRequest => {
						return <div className='flex items-center justify-center mt-5' key={friendRequest.uid}>
							<TeamMember member={friendRequest} owner={null} />
							<div className="mr-auto">
								<p className='pl-5 mr-1 ml-2 text-2xl tooltip tooltip-bottom cursor-pointer' data-tip='Accept' onClick={() => handleAcceptRequest(friendRequest.handle)}>✅</p>
								<p className='pl-5 text-2xl tooltip tooltip-bottom cursor-pointer' data-tip='Decline' onClick={() => handleDeclineRequest(friendRequest.handle)}>❌</p>
							</div>
						</div>
					}) : <div className='flex justify-center'>
						<p className='text-gray-500 text-center mt-20 text-3xl'>
							You have no friend requests.
						</p>
					</div>}


				</div>
			</div>
		</div>
	)
}

export default FriendsRequestsDashboard;