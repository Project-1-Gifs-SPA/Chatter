import { useContext, useEffect, useState } from "react";
import { getChannelById, getLiveChannelSeenBy } from "../../services/channel.service";
import { useNavigate, useParams } from "react-router";
import ChannelXModal from "../ChannelXModal/ChannelXModal";
// import ChannelEditModal from "../ChannelEditModal/ChannelEditModal";
import AppContext from "../../context/AppContext";
import { setTeamSeenBy, setTeamsNotSeenBy } from "../../services/chat.service";
import ContextMenu from "../ContextMenu/ContextMenu";

const ChannelTile = ({ channelId, generalId, isOwner, addMembers, channelMembers, teamMembers, checkedChannels, updateCheckedChannels }) => {

    const { teamId } = useParams();
    const { userData } = useContext(AppContext);

    const [channelName, setChannelName] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [showEditModal, setShowEditModal] = useState(false);

    // const [currentChannel, setCurrentChannel] = useState({});
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
                // setCurrentChannel(channel);
            })
    }, [channelId])

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
            console.log('inside of the else')
            setTeamsNotSeenBy(teamId, userData.handle);
        }
    }, [isChannelSeen])

    return (
        <div className={`flex justify-start items-center rounded my-1 mx-3 h-10 ${isChannelSeen.includes(userData.handle) ? 'bg-gradient-to-r from-gray-600 to-gray-800' : 'bg-gradient-to-r from-purple-700 to-gray-800'}`} onContextMenu={handleContextMenu}>
            <button
                className='text-white ml-4'
                style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}
                onClick={() => { navigate(`/teams/${teamId}/channels/${channelId}`) }}
            >
                <spam className="truncate text-center flex items-center" >
                    {channelName}
                </spam>

            </button >
            {showDeleteModal && <ChannelXModal
                setShowDeleteModal={setShowDeleteModal}
                isVisible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                channelId={channelId} teamId={teamId} isOwner={isOwner}
            />}
            {contextMenuVisible ? <ContextMenu channelList={true} channelId={channelId} isOwner={isOwner} contextMenuVisible={contextMenuVisible} setContextMenuVisible={setContextMenuVisible} setShowDeleteModal={setShowDeleteModal} /> : null}

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
    )
}

export default ChannelTile;
