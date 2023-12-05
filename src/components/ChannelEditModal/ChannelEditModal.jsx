// import { useContext, useRef, useState } from "react";
// import { removeChannel, removeChannelUser, setChannelUsers } from "../../services/channel.service";
// import AppContext from "../../context/AppContext";
// import SearchBarChoose from "../SearchBarChoose/SearchBarChoose";

// const ChannelEditModal = ({ channelId, teamId, isOwner, user, addMembers, channelMembers, teamMembers }) => {

//     const { userData } = useContext(AppContext);
//     const [newChannelUsers, setNewChannelUsers] = useState();

//     const modalRef = useRef(null);

//     return (
//         <div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
//             {/* <dialog ref={modalRef} id="create-channel" className="modal"> */}
//                 <div id='myModal' className='w-[350px] flex flex-col p-10 rounded-md bg-gray-800'>
//                     <h3 className="font-bold text-lg">Channel members</h3>

//                     <SearchBarChoose
//                         addMembers={addMembers}
//                         channelMembers={channelMembers}
//                         teamMembers={teamMembers}
//                     />

//                     <div className="modal-action">

//                         <form method="dialog" >
//                             <button className="btn mr-5 bg-red-700" >Close</button>
//                             <button className="btn"
//                                 onClick={() => { setChannelUsers(teamId, channelId); }}>
                                
//                             Update members
//                             </button>
//                         </form>

//                     </div>
//                 </div>
//             {/* </dialog> */}
//         </div>
//     );
// };

// export default ChannelEditModal;
