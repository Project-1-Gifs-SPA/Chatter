import { useState } from 'react';
import { SlMagnifier } from "react-icons/sl";
import AllFriends from '../../components/AllFriends/AllFriends';
import ChatBot from '../../components/ChatBot/ChatBot';
import FriendsRequestsDashboard from '../../components/FriendsRequestsDashboard/FriendsRequestsDashboard';
import MeetingSideBar from '../../components/MeeetingSideBar/MeetingSideBar';
import OnlineFriends from '../../components/OnlineFriends/OnlineFriends';
import SearchBar from '../../components/SearchBar/SearchBar';

const Dashboard = () => {

  const [show, setShow] = useState('online');
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <div className='bg-gray-700 w-full overflow-y-scroll custom-scrollbar overflow-x-hidden '>
        <div className="border-b border-gray-600 flex px-6 py-2 items-center justify-between shadow-xl" aria-label='friends navigation bar with buttons for online friends, all friends, friend request, a search option button for new friends and a virtual assistant button'>
          <p className="text-white mb-4 lg:mb-0 ml-4 mr-6">Friends</p>
          <div className="flex mr-auto">
            <button className="btn btn-xs btn-neutral" onClick={() => setShow('online')}>Online</button>
            <button className="btn btn-xs ml-4 btn-neutral" onClick={() => setShow('all')}>All</button>
            <button className="btn btn-xs ml-4 btn-neutral" onClick={() => setShow('requests')}>Friend Requests</button>
            <button className='text-white ml-4 btn btn-neutral btn-xs' onClick={() => setShowSearch(!showSearch)}><SlMagnifier /></button>
            <div className='ml-4 h-[25px] border-l border-gray-500'></div>
            <button className="btn btn-xs ml-4 btn-neutral bg-purple-700 hover:bg-purple-900" onClick={() => setShow('meetings')}>vBuddy</button>

          </div>
        </div>
        <div>
          {showSearch && <div className="lg:mt-0 w-[full]">
            <SearchBar />
          </div>}

          <div>
            {show === 'online' ? <OnlineFriends /> : null}
            {show === 'all' ? <AllFriends /> : null}
            {show === 'requests' ? <FriendsRequestsDashboard /> : null}
            {show === 'meetings' ? <ChatBot /> : null}
          </div>
        </div>
      </div>
      <MeetingSideBar />
    </>
  );
};

export default Dashboard;
