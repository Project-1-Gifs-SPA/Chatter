import React from 'react'
import { GoPlus } from "react-icons/go";


const AddTeams = () => {
	return (
		<div className="cursor-pointer">
			<div
				className="bg-white opacity-25 h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-3xl mb-1 overflow-hidden hover:rounded-md ">
				<GoPlus className="h-10 w-10" />
			</div>
		</div>
	)
}

export default AddTeams