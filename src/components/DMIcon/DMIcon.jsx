import React from 'react'
import logo from '../../assets/logoClear.png'
import { useNavigate } from 'react-router-dom';
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import './DMIcon.css'

const DMIcon = () => {

	const navigate = useNavigate();

	return (
		<div className="tooltip tooltip-right" data-tip="Direct messages">
			<div className="cursor-pointer mb-4 border-b border-gray-600 pb-2" onClick={() => navigate('/')}>
				<div className='relative'>

					{/* <div className='absolute top-1 left-0'>
						<div className="animate-blink-icon">
							<RiCheckboxBlankCircleFill style={{ color: 'white' }} />
						</div>
					</div> */}

					<div className="h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-md mb-1 overflow-hidden relative">
						<img src={logo} alt="Direct messages" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default DMIcon