import { useState, useEffect, useContext } from 'react'
import { getLiveTeamInfo, getLiveTeamSeenBy } from '../../services/teams.service';
import { useNavigate } from 'react-router-dom';
import { getGeneralChannel } from '../../services/channel.service';
import ContextMenu from '../ContextMenu/ContextMenu';
import EditTeamModal from '../EditTeamModal/EditTeamModal';
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import AppContext from '../../context/AppContext';

const TeamIcon = ({ id }) => {
	const { userData } = useContext(AppContext)
	const [currentTeam, setCurrentTeam] = useState({});
	const [contextMenuVisible, setContextMenuVisible] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isTeamSeen, setIsTeamSeen] = useState([])

	const navigate = useNavigate();

	const handleContextMenu = (e) => {
		e.preventDefault();
		setContextMenuVisible(true);
	}

	useEffect(() => {
		const unsubscribe = getLiveTeamInfo(data => {
			setCurrentTeam({ ...data })
		}, id)
		return () => {
			unsubscribe();
		}
	}, [id])

	useEffect(() => {
		const unsubscribe = getLiveTeamSeenBy(data => {
			setIsTeamSeen([...data])
		}, id)
		return () => {
			unsubscribe();
		}
	}, [id])

	//console.log('Team is seen by ', isTeamSeen)

	return (
		<>
			<div className="cursor-pointer mb-4" onClick={() =>
				getGeneralChannel(currentTeam.id)
					.then(channelId => navigate(`/teams/${currentTeam.id}/channels/${channelId}`))}
				onContextMenu={handleContextMenu}
			>
				{!isTeamSeen.includes(userData.handle) && <div className='relative top-3'>
					<RiCheckboxBlankCircleFill style={{ color: 'white' }} />
				</div>
				}
				<div className="tooltip tooltip-right" data-tip={currentTeam.name}>
					<div
						className="bg-purple-500 h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-3xl mb-1 overflow-hidden hover:rounded">
						{currentTeam.photoURL ?
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
			</div>
			{contextMenuVisible && <div className='absolute top-auto left-auto z-[1000]'>
				<ContextMenu teamId={id} owner={currentTeam.owner} contextMenuVisible={contextMenuVisible} setContextMenuVisible={setContextMenuVisible}
					showModal={showModal} setShowModal={setShowModal} />
			</div>}

			{showModal ? <EditTeamModal teamId={id} name={currentTeam.name} onClose={() => setShowModal(false)} teamPic={currentTeam.photoURL} /> : null}
		</>
	)
}

export default TeamIcon