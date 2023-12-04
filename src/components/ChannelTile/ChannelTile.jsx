import { useEffect, useRef, useState } from "react";
import { getChannelById, getGeneralChannel, removeChannel } from "../../services/channel.service";
import { useNavigate, useParams } from "react-router";
import { AiOutlineClose } from "react-icons/ai";
import { IoPencil } from "react-icons/io5";
import SearchBar from "../SearchBar/SearchBar";
import ChannelXModal from "../ChannelXModal/ChannelXModal";
import ChannelEditModal from "../ChannelEditModal/ChannelEditModal";

const ChannelTile = ({ channelTileId, generalId, isOwner, addMembers, channelMembers, teamMembers }) => {

    const { teamId } = useParams();

    const [channelName, setChannelName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getChannelById(channelTileId)
            .then(channel => {
                setChannelName(channel.name);
            });
    }, [channelTileId]);

    return (
        <div className="items-center ml-auto mr-auto display-flex">
            <button
                onClick={() => { console.log(channelTileId); navigate(`/teams/${teamId}/channels/${channelTileId}`); }}
            >
                {channelName}
            </button >
            {channelTileId !== generalId && <button
                onClick={() => setShowDeleteModal(!showDeleteModal)}
            >
                <AiOutlineClose />
                {showDeleteModal && <ChannelXModal
                    isVisible={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    channelId={channelTileId} teamId={teamId} isOwner={isOwner}
                />}
            </button>}

            {channelTileId !== generalId && isOwner && <button
                onClick={() => setShowEditModal(!showEditModal)}
            >
                <IoPencil />
                {showEditModal && <ChannelEditModal
                    isVisible={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    channelId={channelTileId} teamId={teamId} isOwner={isOwner}
                    addMembers={addMembers}
                    channelMembers={channelMembers}
                    teamMembers={teamMembers}
                />}
            </button>}
        </div>
    )
}

export default ChannelTile;
