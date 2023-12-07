import { useContext } from "react";
import { removeChannel, removeChannelUser } from "../../services/channel.service";
import AppContext from "../../context/AppContext";

const ChannelXModal = ({ channelId, teamId, isOwner, user, setShowDeleteModal }) => {

    const { userData } = useContext(AppContext);

    return (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
            <div id='myModal' className='w-[350px] flex flex-col p-10 rounded-md bg-gray-800'>
                {isOwner
                    ? <h3 className="font-bold text-lg text-white">Are you sure you want to remove this channel?</h3>
                    : <h3 className="font-bold text-lg text-white">Are you sure you want to leave this channel?</h3>}

                <div className="modal-action">

                    <form className="flex"  method="dialog" >
                        <button className="btn border-none mr-5" onClick={() => setShowDeleteModal(false)}>Close</button>
                        <button className="btn bg-red-500 text-white hover:bg-red-600 mr-8"
                            onClick={isOwner
                                ? () => { console.log(channelId); removeChannel(teamId, channelId).then(() => setShowDeleteModal(false)); }
                                : () => { removeChannelUser(channelId, userData.handle).then(() => setShowDeleteModal(false)); }}>
                            {isOwner
                                ? 'Remove channel'
                                : 'Leave channel'}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default ChannelXModal;
