import { useContext, useRef, useEffect, useState } from "react";
import { getChannelById, getGeneralChannel, removeChannel, getLiveChannelSeenBy } from "../../services/channel.service";
import { useNavigate, useParams } from "react-router";
import { AiOutlineClose } from "react-icons/ai";
import { IoPencil } from "react-icons/io5";
import SearchBar from "../SearchBar/SearchBar";
import ChannelXModal from "../ChannelXModal/ChannelXModal";
// import ChannelEditModal from "../ChannelEditModal/ChannelEditModal";
import AppContext from "../../context/AppContext";
import { setTeamSeenBy, setTeamsNotSeenBy } from "../../services/chat.service";
import { update } from "firebase/database";
import ContextMenu from "../ContextMenu/ContextMenu";

const ChannelTile = ({ channelId, generalId, isOwner, addMembers, channelMembers, teamMembers, checkedChannels, updateCheckedChannels }) => {

    const { teamId } = useParams();
    const { userData } = useContext(AppContext);

    const [channelName, setChannelName] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [showEditModal, setShowEditModal] = useState(false);

    const [currentChannel, setCurrentChannel] = useState({});
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
                setCurrentChannel(channel)
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
    //console.log(isChannelSeen)
    // console.log(checkedChannels)
    //console.log(isChannelSeen)

    // console.log(checkedChannels, ' at ChannelTile')

    return (
        <div className="items-center ml-auto mr-auto display-flex" onContextMenu={handleContextMenu}>
            <button
                className={`${isChannelSeen.includes(userData.handle) ? 'text-white' : 'text-red-400'} ml-4`}
                onClick={() => { navigate(`/teams/${teamId}/channels/${channelId}`) }}
            >
                {channelName}
            </button >
            {/* {channelId !== generalId &&
            <button
                onClick={() => setShowDeleteModal(!showDeleteModal)}
            >
                <AiOutlineClose />
               
            </button>} */}
            {showDeleteModal && <ChannelXModal
                isVisible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                channelId={channelId} teamId={teamId} isOwner={isOwner}
            />}
            {contextMenuVisible ? <ContextMenu channelId={channelId} isOwner={isOwner} contextMenuVisible={contextMenuVisible} setContextMenuVisible={setContextMenuVisible} setShowDeleteModal={setShowDeleteModal} /> : null}

            {/* {channelId !== generalId && isOwner && <button
                onClick={() => setShowEditModal(!showEditModal)}
            >
                <IoPencil />
                {showEditModal && <ChannelEditModal
                    isVisible={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    channelId={channelId} teamId={teamId} isOwner={isOwner}
                    addMembers={addMembers}
                    channelMembers={channelMembers}
                    teamMembers={teamMembers}
                />}
            </button>} */}
            {/* //=======
//         <div>
//             <button className={`${isChannelSeen.includes(userData.handle) ? 'text-white' : 'text-red-400'} ml-4`}
//                 onClick={() => { navigate(`/teams/${teamId}/channels/${channelId}`) }}
//             >
//                 {channelName}
//             </button >
//>>>>>>> main */}
        </div>
    )
}

export default ChannelTile;
