import { useContext, useEffect, useRef, useState } from "react";
import ProfileModal from "../ProfileModal/ProfileModal";
import AddTeam from "../AddTeam/AddTeam";
import { uploadTeamPhoto } from "../../services/storage.service";
import EditTeamModal from "../EditTeamModal/EditTeamModal";
import AppContext from "../../context/AppContext";
import { sendEmailVerification } from "firebase/auth";
import { removeTeamMember } from "../../services/teams.service";
import { deleteGroupMember } from "../../services/dms.service";
import { removeChannelUser } from "../../services/channel.service";
import ChannelXModal from "../ChannelXModal/ChannelXModal";
import AlertModal from "../AlertModal/AlertModal";
import { getLiveUserInfo } from "../../services/users.service";


const ContextMenu = ({teamId,channelList, owner, isOwner, contextMenuVisible, setContextMenuVisible, showModal, setShowModal, channelId, member, groupDmId, setShowDeleteModal}) => {

	const {userData} = useContext(AppContext)

	const [showAlert, setShowAlert] = useState(false);
	const [command, setCommand] = useState('');
	const [currentUser, setCurrentUser] = useState(userData)

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


	useEffect(()=> {

	const unsubscribe = getLiveUserInfo(data=>{

			setCurrentUser({...data})
		},userData.handle)
	
		return () => unsubscribe();

	},[userData])


	// const handleLeave = (e, teamMember) =>{
	// 	e.preventDefault()
	// 	console.log('remove from team')
	// 	removeTeamMember(teamId, teamMember)
	// 	.then(()=>setContextMenuVisible(false));
	// }


	// const handleLeave = () =>{
		
	// 	console.log('remove from team')
	// 	setCommand('leave this team');
	// 	setShowAlert(true)
	// 	setContextMenuVisible(false);
	// }

	const handleLeaveGroup = (e, groupMember) => {
		e.preventDefault();
		deleteGroupMember(groupDmId, groupMember)
		.then(()=>setContextMenuVisible(false));

	}

	const handleLeaveChannel = (e, channelMember)=>{
		e.preventDefault();
		removeChannelUser(channelId, channelMember)
		.then(()=>setContextMenuVisible(false));
	}
    return (
        < >
		<div id="context-menu" > 
        <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box" >
        {( currentUser.handle===owner && !channelId)  
		? <li onClick={()=>{
					setShowModal(true);
					setContextMenuVisible(false);
					console.log(showModal)				
		}} ><a>Edit Team</a></li> 
		: null}
		{((Object.keys(currentUser.teams)).includes(teamId) && !channelList)&&  <li onClick={()=>{setShowAlert(true); setCommand('leave this team');}}><a>Leave Team</a></li>} 
		
		{(( currentUser.myTeams? Object.keys(currentUser.myTeams).includes(teamId):null) && channelId && currentUser.handle!==member) 
		? <li onClick={()=>{setShowAlert(true); setCommand('remove member from team');}}><a>Remove from Team</a></li> 
		: null}
		{groupDmId ? <li onClick={(e)=>handleLeaveGroup(e, currentUser.handle)}><a>Leave Group</a></li> : null}
		{channelId && channelList && !isOwner ? <li onClick={()=>setShowDeleteModal(true)}><a>Leave Channel</a></li> : null}
		{channelId && channelList && isOwner ? <li onClick={()=>setShowDeleteModal(true)}><a>Remove Channel</a></li> : null}
        </ul>
		{showAlert? <AlertModal teamId={teamId} showAlert={setShowAlert} command={command} setContextMenuVisible={setContextMenuVisible} contextMenuVisible={contextMenuVisible}/>:null}
		</div>
        </>
		
    )

}

export default ContextMenu;
