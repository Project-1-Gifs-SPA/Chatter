import React, { useContext } from 'react'
import { IoIosCloseCircle } from "react-icons/io";
import AppContext from '../../context/AppContext';


const ProfileModal = ({ closeModal }) => {
	const { user, userData } = useContext(AppContext);
	const date = new Date(userData.createdOn);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50">
			<div className="bg-gray-800  max-w-2xl h-96 rounded-3xl shadow-2xl flex flex-col">
				<div className='bg-orange-200 rounded-xl flex flex-col'>

					<button className="flex items-center justify-center text-orange-400 text-3xl p-2 self-end  hover:text-orange-500">
						<IoIosCloseCircle onClick={closeModal} className="inline-block align-middle" />
					</button>

					<div className="ml-3 mt-[-30px] mb-5">
						<div className="flex items-center ml-2 ">
							<div className="avatar online">
								<div className="w-20 rounded-full"> {/* Adjust the margin-top */}
									<img src={user.photoURL} alt="User Avatar" />
								</div>
							</div>
						</div>
					</div>

				</div>
				<div className='bg-gray-900 h-full rounded-3xl mt-5 ml-5 mr-5 '>
					<div className="ml-2 mr-10 p-3">
						<p className="text-xl font-bold text-white" style={{ fontFamily: 'Rockwell, sans-serif' }}>
							{userData.firstName} {userData.lastName}
						</p>
						<p className='text-orange-300'>{userData.handle}</p>
					</div>
					<div className="border-b border-gray-700 mt-1 mr-5"></div>
					<div className="ml-5 mt-5">
						<p className="text-md font-bold text-white"
						>Chatter member since:</p>
						<p className="text-sm text-white"
						>{date.toLocaleDateString('en-US')}</p>
					</div>
					<div className="border-b border-gray-700 mt-5 mr-5"></div>
				</div>
			</div>
		</div>
	);
};
export default ProfileModal