import React, { useState } from 'react'
import ProfileModal from '../ProfileModal/ProfileModal';

const TeamMember = ({ member, owner }) => {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<div className="flex p-3 relative">
				{member.handle === owner && (<p className="absolute top-2 left-8 transform -translate-x-1/2 -translate-y-1/2 tooltip tooltip-right" data-tip='Team owner'>👑</p>)}
				<div className={`avatar ${member.availability} relative z-[0]`}>

					<div className="w-10 rounded-full">
						<img src={member.photoURL} alt="User Avatar"
							onClick={() => setShowModal(true)} />
					</div>
				</div>
				<div className="leading-4 pl-3 text-white">
					<h4 className="font-semibold hidden sm:flex">{member.firstName} {member.lastName}</h4>
					<span className="text-xs text-white hidden sm:flex">{member.handle}</span>
				</div>
			</div >
			{showModal && (

				<div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
					<div className='w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] flex flex-col'>
						{/* ProfileModal content */}
						<ProfileModal isVisible={showModal} onClose={() => setShowModal(false)} profile={member} />
					</div>
				</div>
			)}
			{/* {showModal && <ProfileModal isVisible={showModal} onClose={() => setShowModal(false)} publicProfile={member} />} */}
		</>
	)
}

export default TeamMember