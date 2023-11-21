import React from 'react'

const Loader = () => {
	return (
		<div className='h-screen flex justify-center items-center bg-gray-900'>
			<span className="h-20 w-20 loading loading-spinner text-primary"></span>
		</div>
	)
}

export default Loader