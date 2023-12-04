import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import { addFriends, declineFriendRequest, getLiveUserInfo, getUserByHandle } from "../../services/users.service";
import TeamMember from "../TeamMember/TeamMember";


const FriendsRequestsDashboard = () => {


    const {userData} = useContext(AppContext);
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
			<div className='w-[350px] flex flex-col'>
				<div>
					{requests.length ? requests.map(friendRequest => {
						return <div className='flex items-center justify-center mt-5' key={friendRequest.uid}>
							<TeamMember member={friendRequest} owner={null} />
							<p className='pl-5 mr-1 ml-2 text-2xl tooltip tooltip-bottom cursor-pointer' data-tip='Accept' onClick={() => handleAcceptRequest(friendRequest.handle)}>✅</p>
							<p className='pl-5 text-2xl tooltip tooltip-bottom cursor-pointer' data-tip='Decline' onClick={() => handleDeclineRequest(friendRequest.handle)}>❌</p>
						</div>}) : <h1>You have no new friend requests</h1>}

    
</div>
</div>
</div>
    )
}

export default FriendsRequestsDashboard;