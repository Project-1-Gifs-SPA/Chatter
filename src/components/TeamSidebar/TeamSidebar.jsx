import React, { useEffect, useState } from 'react'
import { IoPeopleSharp } from "react-icons/io5";
import { IoPeopleOutline } from "react-icons/io5";
import { useParams } from 'react-router';
import { getLiveTeamInfo } from '../../services/teams.service';

const TeamSidebar = () => {
	const [expanded, setExpanded] = useState(true)
	const [currentTeam, setCurrentTeam] = useState({});

	const { teamId } = useParams();

	useEffect(() => {
		console.log('get team info')

		const unsubscribe = getLiveTeamInfo(data => {
			setCurrentTeam({ ...data })
		}, teamId)
		return () => {
			unsubscribe();
		}
	}, [teamId])

	console.log(currentTeam.members)

	return (
		<div className="h-screen flex justify-end bg-gray-800">
			<div className="h-full flex flex-col border-r shadow-sm bg-gray-800">
				<div className="border-b border-gray-600 flex px-6 py-2 items-center justify-between shadow-xl">
					<p className={`text-white overflow-hidden transition-all ${expanded ? "w-54" : "w-0"
						}`}>Members</p>
					<button
						onClick={() => setExpanded((curr) => !curr)}
						className="p-0 p-0 rounded-lg focus:outline-none"
					>
						{expanded ? <div className='tooltip tooltip-bottom' data-tip="Hide members"><IoPeopleOutline className="text-purple-500 text-2xl" /></div> :
							<div className='tooltip tooltip-bottom' data-tip="Show members"><IoPeopleSharp className="text-purple-500 text-2xl" /></div>
						}
					</button>
				</div>

				<div className="flex p-3">
					<img
						src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
						alt=""
						className="w-10 h-10 rounded-md"
					/>
					<div
						className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-64" : "w-0"}
          `}
					>
						<div className="leading-4 pl-3 text-white">
							<h4 className="font-semibold">John Doe</h4>
							<span className="text-xs text-white">johndoe99</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TeamSidebar