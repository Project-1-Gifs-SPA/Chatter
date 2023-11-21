import React from 'react'
import TeamIcon from '../TeamIcon/TeamIcon';
import DMIcon from '../DMIcon/DMIcon';
import AddTeams from '../AddTeams/AddTeams';

const SideBar = () => {
	return (
		<>
			<div className="bg-gray-900 text-purple-lighter flex-none w-24 p-6 hidden md:block ">
				<DMIcon />
				<TeamIcon />
				<TeamIcon />
				<TeamIcon />
				<TeamIcon />
				<AddTeams />
			</div>
		</>
	)
}

export default SideBar