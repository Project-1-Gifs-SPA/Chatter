import { useContext, useEffect, useRef, useState } from "react";
import ProfileModal from "../ProfileModal/ProfileModal";
import AddTeam from "../AddTeam/AddTeam";
import { uploadTeamPhoto } from "../../services/storage.service";
import EditTeamModal from "../EditTeamModal/EditTeamModal";
import AppContext from "../../context/AppContext";
import { sendEmailVerification } from "firebase/auth";
import { removeTeamMember } from "../../services/teams.service";


const ContextMenu = ({teamId, contextMenuVisible, setContextMenuVisible, showModal, setShowModal}) => {

	const {userData} = useContext(AppContext)

	useEffect(() => {
		const handleClickOutside = (event) => {
			const modal = document.getElementById('context-menu');
			if (modal && !modal.contains(event.target)) {
				setContextMenuVisible(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [setContextMenuVisible]);


	const handleLeave = (e) =>{
		e.preventDefault()
		console.log('remove from team')
		removeTeamMember(teamId, userData.handle)
		.then(()=>setContextMenuVisible(false));
	}
    return (
        < >
		<div id="context-menu" > 
        <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box" >
        {( userData.myTeams? Object.keys(userData.myTeams).includes(teamId):null)  ? <li onClick={()=>{
					setShowModal(true);
					setContextMenuVisible(false);
					console.log(showModal)
					
		}} ><a>Edit Team</a></li> : null}
		{( userData.teams? Object.keys(userData.teams).includes(teamId):null) ? <li onClick={handleLeave}><a>Leave Team</a></li> : null}
        </ul>
		</div>
        </>


    )

}

export default ContextMenu;
