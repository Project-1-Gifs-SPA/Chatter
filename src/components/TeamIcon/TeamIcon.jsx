import React, { useState, useEffect, useLayoutEffect, useContext } from 'react'
import { getLiveTeamInfo } from '../../services/teams.service';
import { set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { getGeneralChannel } from '../../services/channel.service';
import ContextMenu from '../ContextMenu/ContextMenu';
import AppContext from '../../context/AppContext';
import EditTeamModal from '../EditTeamModal/EditTeamModal';

const TeamIcon = ({ id }) => {

	const{userData} = useContext(AppContext)
	const [currentTeam, setCurrentTeam] = useState({});
	const [contextMenuVisible, setContextMenuVisible] = useState(false);
	const[showModal, setShowModal] = useState(false);
	
	const navigate = useNavigate();
	

	const handleContextMenu =(e)=>{	
		e.preventDefault();
		setContextMenuVisible(true);
}

	useEffect(() => {
		console.log('get team info')

		const unsubscribe = getLiveTeamInfo(data => {

			setCurrentTeam({ ...data })

		}, id)
		return () => {
			unsubscribe();
		}

	}, [id])

	return (
		<>
		<div className="cursor-pointer mb-4" onClick={() =>
			getGeneralChannel(currentTeam.id)
				.then(channelId => navigate(`/teams/${currentTeam.id}/channels/${channelId}`))}
				onContextMenu={handleContextMenu}
		>
			
			<div className="tooltip tooltip-right" data-tip={currentTeam.name}>
				<div
					className="bg-orange-500 h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-3xl mb-1 overflow-hidden hover:rounded-md">
					{currentTeam.photoURL?
					
					<img src={currentTeam.photoURL} />
					: currentTeam?.name && (
						<span className='text-xl'>
							{currentTeam.name.includes(' ')
								? currentTeam.name.split(' ').map(name => name[0]).join('')
								: currentTeam.name.substring(0, 1)}
						</span>
					)}
				</div>
				
			</div>
			
		</div >
		{contextMenuVisible &&  <ContextMenu teamId={id} contextMenuVisible={contextMenuVisible} setContextMenuVisible={setContextMenuVisible} 
		showModal={showModal} setShowModal={setShowModal}/>}
		{showModal ?<EditTeamModal teamId={id} name={currentTeam.name} onClose={()=>setShowModal(false)} teamPic={currentTeam.photoURL}/> : null}
		</>
	)
}

export default TeamIcon