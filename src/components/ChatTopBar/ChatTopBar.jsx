import { useContext, useEffect, useState } from 'react';
import { BsCalendarEvent } from 'react-icons/bs';
import { useParams } from 'react-router';
import AppContext from '../../context/AppContext';
import { getChannelById } from '../../services/channel.service';
import { getDMbyId } from '../../services/dms.service';

const ChatTopBar = ({ meeting }) => {

  const { channelId, dmId } = useParams();

  const { userData } = useContext(AppContext);

  const [channelName, setChannelName] = useState('');
  const [members, setMembers] = useState('');

  useEffect(() => {
    if (channelId) {
      getChannelById(channelId)
        .then((channel) => setChannelName(channel.name))
        .catch((e) => console.error(e));
    }

    if (dmId) {
      getDMbyId(dmId)
        .then((dm) => setMembers(Object.keys(dm.members).filter(member => member !== userData.handle)))
        .catch((e) => console.error(e));
    }
  }, [channelId, dmId]);

  return (<>
    <div className=" flex px-6 py-2 items-center justify-between">
      <div className="flex flex-col">
        {/* <h3>Hard coded</h3> */}
        {channelId &&
          <h3 className="text-white  font-bold text-xl text-gray-100">
            <span className="text-gray-400">#</span> {channelName}
          </h3>
        }
        {dmId &&
          <h3 className="text-white mb-1 font-bold text-xl text-gray-100">
            {members.length > 1 ? members.join(', ') : members}
          </h3>
        }
        {meeting &&
          <h3 className="text-white mb-1 font-bold text-xl text-gray-100 flex">
            <span className="text-gray-400 mr-3 pt-1">{<BsCalendarEvent />}</span> {meeting.topic}
          </h3>
        }
      </div>
    </div >
    <div className="border-t border-gray-600 py-1"></div>
  </>
  );
};

export default ChatTopBar;
