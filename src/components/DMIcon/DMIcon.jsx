import React from 'react'
import logo from '../../assets/logoClear.png'

const DMIcon = () => {
	return (
		<div className="tooltip tooltip-right" data-tip="Direct messages">
			<div className="cursor-pointer mb-4 border-b border-gray-600 pb-2 ">
				<div
					className="h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-md mb-1 overflow-hidden">
					<img src={logo} alt="Direct messages" />
				</div>
			</div>
		</div>
	)
}

export default DMIcon