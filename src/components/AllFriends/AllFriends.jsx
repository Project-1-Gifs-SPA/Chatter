import { useEffect, useState, useContext } from 'react'
import Friends from '../Friends/Friends';
import { getLiveUserFriends } from '../../services/users.service';
import AppContext from '../../context/AppContext';

const AllFriends = () => {
	const { userData } = useContext(AppContext);
	const [friends, setFriends] = useState({});

	useEffect(() => {
		const unsubscribe = getLiveUserFriends(data => {
			setFriends(data)
		}, userData.handle)
		return () => {
			unsubscribe();
		}
	}, [userData.handle])


	return (
		<div className='text-white mt-5'>
			<h1 className='text-gray-400 text-sm pl-4 font-semibold'>All friends - {Object.keys(friends).length}</h1>
			<div className="border-t border-gray-500 my-4"></div>
			<div className='mt-5'>
				{Object.keys(friends).length > 0 ? Object.keys(friends).map((friend, id) => {
					return <Friends friend={friend} key={id} />
				}) : (
					<div className='flex justify-center'>
						<p className='text-gray-500 text-center mt-20 text-3xl'>
							Your friends list seems lonely.<br className="md:hidden lg:inline" /> Connect with friends to start chatting.
						</p>
					</div>
				)}
			</div>
		</div >
	)
}

export default AllFriends