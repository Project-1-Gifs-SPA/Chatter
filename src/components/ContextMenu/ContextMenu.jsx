import { useEffect, useRef, useState } from "react";
import ProfileModal from "../ProfileModal/ProfileModal";
import AddTeam from "../AddTeam/AddTeam";
import { uploadTeamPhoto } from "../../services/storage.service";
import EditTeamModal from "../EditTeamModal/EditTeamModal";


const ContextMenu = ({ onClose, teamId}) => {

	const[showModal, setShowModal] = useState(false);


   


	// useEffect(() => {
	// 	const handleClickOutside = (event) => {
	// 		const modal = document.getElementById('context-menu');
	// 		if (modal && !modal.contains(event.target)) {
	// 			onClose();
	// 		}
	// 	};

	// 	document.addEventListener('mousedown', handleClickOutside);
	// 	return () => {
	// 		document.removeEventListener('mousedown', handleClickOutside);
	// 	};
	// }, [onClose]);


	const handleClick = (e) =>{
		e.preventDefault();
		setShowModal(true);
	}


    return (
        <>
        <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box" id="context-menu" >
        <li onClick={handleClick} ><a>Edit Team</a></li>
        </ul>
		{showModal && <EditTeamModal isVisible={showModal} teamId={teamId} onClose={()=> setShowModal(false)} />}

        </>


    )

}

export default ContextMenu;
