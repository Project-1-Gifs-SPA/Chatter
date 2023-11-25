import { useEffect, useState } from "react";
import { getChannelById } from "../../services/channel.service";
import { useNavigate, useParams } from "react-router";

const ChannelTile = ({channelId}) => {

    const { teamId } = useParams();

    const [channelName, setChannelName] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        console.log('channel id ==========================================');
        console.log(channelId)
        getChannelById(channelId)
            .then(channel => {
                console.table(channel);
                setChannelName(channel.name);
            })
    }, [channelId])

    return (
        <button
            onClick={() => {navigate(`/teams/${teamId}/channels/${channelId}`)}}
        >
            { channelName }
        </button >
    )
}

export default ChannelTile;
