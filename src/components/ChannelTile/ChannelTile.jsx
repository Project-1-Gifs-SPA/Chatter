import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import AppContext from "../../context/AppContext";
import { getChannelById, getChannelIdsInTeamByUser, getLiveChannelSeenBy } from "../../services/channel.service";
import { setTeamSeenBy, setTeamsNotSeenBy } from "../../services/chat.service";
import ChannelXModal from "../ChannelXModal/ChannelXModal";
import ContextMenu from "../ContextMenu/ContextMenu";

const ChannelTile = ({ channelId, generalId, isOwner, addMembers, channelMembers, teamMembers, checkedChannels, updateCheckedChannels, setCurrentChannels }) => {

  const { teamId } = useParams();
  const { userData } = useContext(AppContext);

  const [channelName, setChannelName] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isChannelSeen, setIsChannelSeen] = useState([]);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);

  const navigate = useNavigate();

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuVisible(true);
  }

  useEffect(() => {
    getChannelById(channelId)
      .then(channel => {
        setChannelName(channel.name);
      })
      .catch((e) => console.error(e))
  }, [channelId]);

  useEffect(() => {
    const unsubscribe = getLiveChannelSeenBy(data => {
      setIsChannelSeen([...data]);
    }, channelId)

    return () => {
      unsubscribe();
    }
  }, [channelId]);
  // updateCheckedChannels(0)

  // useEffect(() => {
  //     if (isChannelSeen.includes(userData.handle)) {
  //         console.log('entered')
  //         updateCheckedChannels(checkedChannels + 1)
  //         console.log('updating checked channels: ', checkedChannels)
  //     }
  //     // if (!isChannelSeen.includes(userData.handle)) {
  //     //     console.log('second if')
  //     //     updateCheckedChannels(checkedChannels - 1)
  //     //     console.log('decreasing checked channels: ', checkedChannels)
  //     // }
  // }, [isChannelSeen])

  useEffect(() => {
    if (isChannelSeen.includes(userData.handle)) {
      setTeamSeenBy(teamId, userData.handle);
    } else {
      setTeamsNotSeenBy(teamId, userData.handle);
    }
  }, [isChannelSeen]);

  useEffect(() => {
    if (!showDeleteModal) {
      getChannelIdsInTeamByUser(teamId, userData.handle)
        .then(channels => setCurrentChannels(channels))
        .catch((e) => console.error(e));
    }
  }, [showDeleteModal]);

  return (
    <>
      <div className={`flex justify-start items-center rounded my-1 mx-3 h-10 cursor-pointer ${isChannelSeen.includes(userData.handle) ? 'bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700' : 'bg-gradient-to-r from-purple-700 to-gray-800 hover:from-purple-500 hover:to-gray-700'} hover:bg-gray-800`}
        onContextMenu={handleContextMenu}
        onClick={() => { navigate(`/teams/${teamId}/channels/${channelId}`) }}
      >
        <spam className="truncate text-center flex items-center text-white ml-4"
          style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}>
          {channelName}
        </spam>

        {showDeleteModal && <ChannelXModal
          setShowDeleteModal={setShowDeleteModal}
          isVisible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          channelId={channelId} teamId={teamId} isOwner={isOwner}
        />}

        {/* {/* {/* isVisible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                channelId={channelId} teamId={teamId} isOwner={isOwner}
            />}
            {contextMenuVisible ? <ContextMenu
                channelList={true}
                channelId={channelId}
                isOwner={isOwner}
                contextMenuVisible={contextMenuVisible}
                setContextMenuVisible={setContextMenuVisible}
                setShowDeleteModal={setShowDeleteModal} /> : null} } */}
      </div>
      {contextMenuVisible &&
        <div className='relative top-auto -mb-10 left-10 z-[0] overflow-hidden'> <ContextMenu channelList={true} channelId={channelId} isOwner={isOwner} contextMenuVisible={contextMenuVisible} setContextMenuVisible={setContextMenuVisible} setShowDeleteModal={setShowDeleteModal} /></div>
      }
    </>
  );
};

export default ChannelTile;
