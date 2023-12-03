import { useEffect, useRef, useState } from "react";
import { getChannelById, getGeneralChannel, removeChannel } from "../../services/channel.service";
import { useNavigate, useParams } from "react-router";
import { AiOutlineClose } from "react-icons/ai";
import SearchBar from "../SearchBar/SearchBar";
import ChannelModal from "../ChannelModal/ChannelModal";

const ChannelTile = ({ channelTileId, generalId, isOwner }) => {

    const { teamId } = useParams();

    const [channelName, setChannelName] = useState('');
    const [channelIdKept, setChannelIdKept] = useState('');
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const modalRef = useRef(null);

    useEffect(() => {
        setChannelIdKept(channelTileId);
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
            {channelTileId !== generalId && isOwner && <button
                onClick={() => setShowModal(!showModal) }
            >
                <AiOutlineClose />
                {showModal && <ChannelModal isVisible={showModal} onClose={() => setShowModal(false)} channelId={channelTileId} teamId={teamId} />}
                {/* <dialog ref={modalRef} id="delete-channel" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Are you sure you want to remove this channel?</h3>

                        <div className="modal-action">

                            <form method="dialog" >
                                <button className="btn mr-5" >Close</button>
                                <button className="btn bg-red-700"
                                    onClick={() => { console.log(channelTileId); console.log(channelIdKept); removeChannel(teamId, channelTileId); }}>Remove channel</button>
                            </form>

                        </div>
                    </div>
                </dialog> */}
            </button>}
        </div>
    )
}

export default ChannelTile;
