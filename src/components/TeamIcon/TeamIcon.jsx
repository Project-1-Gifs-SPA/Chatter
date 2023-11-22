import React, { useState, useEffect } from 'react'
import { getLiveTeamInfo } from '../../services/teams.service';
import { set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const TeamIcon = ({ id }) => {


	const [currentTeam, setCurrentTeam] = useState({});
	const navigate = useNavigate();


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
		<div className="cursor-pointer mb-4" onClick={() => navigate(`/teams/${currentTeam.id}`)}>
			<div className="tooltip tooltip-right" data-tip={currentTeam.name}>
				<div
					className="bg-orange-500 h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-3xl mb-1 overflow-hidden hover:rounded-md">
					{currentTeam?.name && (
						<span className='text-xl'>
							{currentTeam.name.includes(' ')
								? currentTeam.name.split(' ').map(name => name[0]).join('')
								: currentTeam.name.substring(0, 1)}
						</span>
					)}
				</div>

			</div>
		</div >
	)
}

export default TeamIcon