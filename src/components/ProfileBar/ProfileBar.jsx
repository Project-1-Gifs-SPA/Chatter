import React, { useContext, useState } from 'react'
import AppContext from '../../context/AppContext'
import { IoSettingsSharp } from "react-icons/io5";
import ProfileModal from '../ProfileModal/ProfileModal';

const ProfileBar = () => {
	const { user, userData } = useContext(AppContext);
	const [showModal, setShowModal] = useState(false); // State to manage modal visibility

	const openModal = () => {
		setShowModal(true);
	};
	const closeModal = () => {
		setShowModal(false);
	};

	return (
		<>
			<div className="bg-gray-900 py-4 text-white flex items-center justify-between">
				<div className="flex items-center ml-2 tooltip cursor-pointer" data-tip="User profile" onClick={openModal}>
					<div className="avatar online">
						<div className="w-10 rounded-full">
							<img src={user.photoURL} alt="User Avatar" />
						</div>
					</div>
					<div className="ml-2">
						<p>{userData.firstName}</p>
					</div>
				</div>
				<div className="text-2xl mr-3 tooltip cursor-pointer" data-tip="User settings">
					<IoSettingsSharp />
				</div>
			</div>
			{showModal && <ProfileModal closeModal={closeModal} />}
		</>
	)
}

// the avatar can be changed online or offline depending on what we chose
export default ProfileBar