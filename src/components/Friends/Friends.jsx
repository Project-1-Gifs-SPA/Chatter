import { useEffect, useState, useContext } from 'react'
import { getLiveUserInfo, getUserByHandle, removeFriends } from '../../services/users.service'
import { createDM } from '../../services/dms.service'
import AppContext from '../../context/AppContext'
import { useNavigate } from 'react-router';
import { TbMessageChatbot } from "react-icons/tb";
import { MdPersonAddDisabled } from "react-icons/md";

const Friends = ({ friend }) => {
	const { userData } = useContext(AppContext);
	const [currentFriend, setCurrentFriend] = useState({});
	const [currentUser, setCurrentUser] = useState({});
	const navigate = useNavigate();

	useEffect(
		() => {
			const u1 = getLiveUserInfo(
				data => {
					setCurrentUser(data);
				},
				userData.handle);
			return () => {
				u1();
			};
		}, [userData]);

	useEffect(() => {
		getUserByHandle(friend)
			.then(response => response.exists() ? setCurrentFriend({ ...response.val() }) : null)
	}, [friend])

	const handleSendDM = (e) => {
		e.preventDefault();

		if (currentUser.DMs[currentFriend.handle]) {
			navigate(`/dms/${currentUser.DMs[currentFriend.handle]}`);
		}
		else {
			console.log('you dont have dms with this person')
			createDM(currentFriend.handle, currentUser.handle)
				.then((dmId) => navigate(`/dms/${dmId}`))

		}
	}

	const handleRemoveFriends = (user) => {
		removeFriends(userData.handle, user)
	}

	return (
		<div className='flex items-center m-4'>
			<div className={`avatar ${currentFriend.availability} relative z-[0]`}>
				<div className="w-10 rounded-full">
					<img src={currentFriend.photoURL} alt="User Avatar" />
				</div>
			</div>

			<div className="leading-4 pl-3 text-white">
				<h4 className="font-semibold hidden sm:flex"> {currentFriend.firstName} {currentFriend.lastName}</h4>
				<span className="text-xs text-white hidden sm:flex">@{currentFriend.handle}</span>
			</div>
			<div className='ml-auto'>
			<div className='cursor-pointer tooltip tooltip-top ml-5' data-tip='Send message' onClick={handleSendDM}><TbMessageChatbot className='text-2xl' />
			</div>

			{
				currentUser.friends && <div className='tooltip tooltip-top' data-tip='Remove friend'>
					<MdPersonAddDisabled className='ml-5 cursor-pointer text-white text-xl hidden sm:flex' onClick={() => handleRemoveFriends(currentFriend.handle)} />
				</div>
			}
			</div>
		</div>
	)
}

export default Friends