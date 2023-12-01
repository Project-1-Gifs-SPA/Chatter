import { useEffect, useState } from "react";
import { getChannelById, getGeneralChannel, removeChannel } from "../../services/channel.service";
import { useNavigate, useParams } from "react-router";
import { AiOutlineClose } from "react-icons/ai";

const ChannelTile = ({ channelTileId, generalId }) => {

    const { teamId } = useParams();

    const [channelName, setChannelName] = useState('');
    const [channelIdKept, setChannelIdKept] = useState('');

    const handleRemoveChannel = (id) => (teamId) => {
        removeChannel(teamId, id);
    }

    const navigate = useNavigate();

    useEffect(() => {
        // setChannelIdKept(handleRemoveChannel(channelTileId));
        console.log(`channelTileId ${channelTileId}`);
        setChannelIdKept(channelTileId);
        console.log(`channelIdKept ${channelIdKept}`);
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
                onClick={() => { document.getElementById("delete-channel").showModal() }}
            >
                <AiOutlineClose />
                <dialog id="delete-channel" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Are you sure you want to remove this channel?</h3>
                        <span className="bg-red">{ }</span>

                        <div className="modal-action">

                            <form method="dialog" >
                                <button className="btn mr-5" >Close</button>
                                <button className="btn bg-red-700"
                                    onClick={(id) => { console.log(id); console.log(channelTileId); console.log(channelIdKept); /*removeChannel(teamId, channelTileId);*/ }}>Remove channel</button>
                            </form>

                        </div>
                    </div>
                </dialog>
            </button>}
        </div>
    )
}

export default ChannelTile;
