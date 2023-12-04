import { useContext, useRef, useEffect, useState } from "react";
import { getChannelById, getGeneralChannel, removeChannel, getLiveChannelSeenBy } from "../../services/channel.service";
import { useNavigate, useParams } from "react-router";
import { AiOutlineClose } from "react-icons/ai";
import { IoPencil } from "react-icons/io5";
import SearchBar from "../SearchBar/SearchBar";
import ChannelXModal from "../ChannelXModal/ChannelXModal";
import ChannelEditModal from "../ChannelEditModal/ChannelEditModal";
import AppContext from "../../context/AppContext";
import { setTeamSeenBy, setTeamsNotSeenBy } from "../../services/chat.service";
import { update } from "firebase/database";

const ChannelTile = ({ channelId, generalId, isOwner, addMembers, channelMembers, teamMembers, checkedChannels, updateCheckedChannels }) => {

    const { teamId } = useParams();
    const { userData } = useContext(AppContext);

    const [channelName, setChannelName] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [currentChannel, setCurrentChannel] = useState({})
    const [isChannelSeen, setIsChannelSeen] = useState([])


    const navigate = useNavigate();

    useEffect(() => {
        getChannelById(channelId)
            .then(channel => {
                setChannelName(channel.name);
                setCurrentChannel(channel)
            })
    }, [channelId])

    useEffect(() => {
        const unsubscribe = getLiveChannelSeenBy(data => {
            setIsChannelSeen(data)
        }, channelId)
        return () => {
            unsubscribe();
        }
    }, [channelId])

    //console.log('channel ', channelId, ' is seen by ', isChannelSeen)

    useEffect(() => {
        console.log('is working? ', isChannelSeen)
        if (isChannelSeen.includes(userData.handle)) {
            updateCheckedChannels(checkedChannels + 1)
        }
        // else {
        //     updateCheckedChannels(checkedChannels - 1)
        // }
    }, [isChannelSeen])

    return (
//<<<<<<< team-channel
        <div className="items-center ml-auto mr-auto display-flex">
            <button
                className={`${isChannelSeen.includes(userData.handle) ? 'text-white' : 'text-red-400'} ml-4`}
                onClick={() => { console.log(channelId); navigate(`/teams/${teamId}/channels/${channelId}`); }}
            >
                {channelName}
            </button >
            {channelId !== generalId &&
            <button
                onClick={() => setShowDeleteModal(!showDeleteModal)}
            >
                <AiOutlineClose />
                {showDeleteModal && <ChannelXModal
                    isVisible={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    channelId={channelId} teamId={teamId} isOwner={isOwner}
                />}
            </button>}

            {channelId !== generalId && isOwner && <button
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
            </button>}
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
