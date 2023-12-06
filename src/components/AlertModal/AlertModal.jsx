import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import { removeTeamMember } from "../../services/teams.service";


const AlertModal = ({showAlert, command, setContextMenuVisible, teamId}) => {

    const [action, setAction] = useState(command);
    const {userData} = useContext(AppContext)

    const handleClick = (e)=> {
        e.preventDefault();
        if(command==='leave this team'){
        console.log('leave team')
        removeTeamMember(teamId, userData.handle)
        .then(()=>{
            showAlert(false)
            setContextMenuVisible(false);
        })
        }

      

    }
// const handleLeave = (e, teamMember) =>{
	// 	e.preventDefault()
	// 	console.log('remove from team')
	// 	removeTeamMember(teamId, teamMember)
	// 	.then(()=>setContextMenuVisible(false));
	// }
    




    return (

        <div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
        <div id='myModal' className='w-[auto] flex flex-col p-10 rounded-md bg-gray-800'>
            {/* {action==='leave' */}
                 <h3 className="font-bold text-lg">Are you sure you want to {action}?</h3>
                {/* : <h3 className="font-bold text-lg">Are you sure you want to leave this channel?</h3>} */}

            <div className="modal-action">

                <form method="dialog" >
                    <button className="btn mr-5" onClick={()=>{showAlert(false); setContextMenuVisible(false)}} >Close</button>
                    <button className="btn bg-red-700"
                        onClick={handleClick}
                        >
                             Confirm
                            
                    </button>
                </form>

            </div>
        </div>
    </div>



    )

}

export default AlertModal;