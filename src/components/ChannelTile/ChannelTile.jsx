import { useContext, useEffect, useState } from "react";
import { getChannelById, getLiveChannelSeenBy } from "../../services/channel.service";
import { useNavigate, useParams } from "react-router";
import AppContext from "../../context/AppContext";
import { setChannelSeenBy, setTeamSeenBy, setTeamsNotSeenBy } from "../../services/chat.service";

const ChannelTile = ({ channelId }) => {

    const { teamId } = useParams();
    const { userData } = useContext(AppContext);

    const [channelName, setChannelName] = useState('');
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
            setIsChannelSeen([...data])
        }, channelId)
        return () => {
            unsubscribe();
        }
    }, [channelId])

    console.log('channel ', channelId, ' ', isChannelSeen)

    useEffect(() => {
        if (!isChannelSeen.includes(userData.handle)) {
            setTeamsNotSeenBy(teamId, userData.handle);
        } else {
            setTeamSeenBy(teamId, userData.handle)
        }
    }, [isChannelSeen])

    return (
        <div>
            <button className={`${isChannelSeen.includes(userData.handle) ? 'text-white' : 'text-red-400'} ml-4`}
                onClick={() => { navigate(`/teams/${teamId}/channels/${channelId}`) }}
            >
                {channelName}
            </button >
        </div>
    )
}

export default ChannelTile;
