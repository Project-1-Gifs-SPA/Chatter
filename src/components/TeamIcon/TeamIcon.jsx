import React, { useState, useEffect } from 'react'
import { getLiveTeamInfo } from '../../services/teams.service';
import { set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const TeamIcon = ({id}) => {


	const [currentTeam, setCurrentTeam] = useState({});
	const navigate = useNavigate();


	useEffect(()=>{
		console.log('get team info')

		const unsubscribe =	getLiveTeamInfo( data=> {

		setCurrentTeam({...data})

		}, id)
		return ()=>{
			unsubscribe();
		}

	},[id])


	

	return (
		<div className="cursor-pointer mb-4" onClick={()=> navigate(`/teams/${currentTeam.id}`)}>
			<div className="tooltip" data-tip={currentTeam.name}>
			<div
				className="bg-white h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-3xl mb-1 overflow-hidden hover:rounded-md">
				<img src="https://cdn.discordapp.com/embed/avatars/4.png" alt="" />
				
			</div>

			</div>	
		</div>
	)
}

export default TeamIcon