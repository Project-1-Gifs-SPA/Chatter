import { removeChannel } from "../../services/channel.service";

const ChannelModal = ({ channelId, teamId }) => {
    return (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
            <div id='myModal' className='w-[350px] flex flex-col p-10 rounded-md bg-gray-800'>
                    <h3 className="font-bold text-lg">Are you sure you want to remove this channel?</h3>

                    <div className="modal-action">

                        <form method="dialog" >
                            <button className="btn mr-5" >Close</button>
                            <button className="btn bg-red-700"
                                onClick={() => { console.log(channelId); removeChannel(teamId, channelId); }}>Remove channel</button>
                        </form>

                    </div>
            </div>
        </div>
    );
};

export default ChannelModal;
