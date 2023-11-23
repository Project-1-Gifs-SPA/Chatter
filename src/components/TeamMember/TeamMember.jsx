import React from 'react'

const TeamMember = ({ member, owner }) => {
	return (
		<div className="flex p-3 relative">
			{member.handle === owner && (<p p className="absolute top-2 left-8 transform -translate-x-1/2 -translate-y-1/2">👑</p>)}
			<div className={`avatar ${member.availability} relative`}>
				<div className="w-10 rounded-full">
					<img src={member.photoURL} alt="User Avatar" />
				</div>
			</div>
			<div className="leading-4 pl-3 text-white">
				<h4 className="font-semibold">{member.firstName} {member.lastName}</h4>
				<span className="text-xs text-white">{member.handle}</span>
			</div>
		</div >
	)
}

export default TeamMember