import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { getLiveUserFriends, getUserByHandle } from '../../services/users.service';
import Friends from '../Friends/Friends';

const OnlineFriends = () => {
  const { userData } = useContext(AppContext);
  const [friends, setFriends] = useState([]);
  const [friendsDetails, setFriendsDetails] = useState([]);

  useEffect(() => {
    const unsubscribe = getLiveUserFriends(data => {
      setFriends(data)
    }, userData.handle);

    return () => {
      unsubscribe();
    }
  }, [userData.handle]);

  useEffect(() => {
    const promises = Object.keys(friends).map(friend =>
      getUserByHandle(friend)
        .then((snapshot) => snapshot.val())
        .catch((e) => console.error(e))
    );

    Promise.all(promises)
      .then((friendsData) => setFriendsDetails(friendsData))
      .catch((e) => console.error(e));
  }, [friends]);

  const online = friendsDetails.filter(friend => friend.availability === 'online');

  return (
    <div className='text-white mt-5'>
      <h1 className='text-gray-400 text-sm pl-4 font-semibold'>Online friends - {online.length}</h1>
      <div className="border-t border-gray-500 my-4"></div>
      <div>
        {(Object.keys(friends).length > 0 && online.length > 0) ? online.map((friend, id) => {
          return <Friends friend={friend.handle} key={id} />
        }) : (
          <div className='flex justify-center'>
            <p className='text-gray-500 text-center mt-20 text-3xl' >
              Your friends list seems lonely.<br className="md:hidden lg:inline" /> Connect with friends to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineFriends;
