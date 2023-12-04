import { useState } from "react"
import { BsCalendarEvent } from "react-icons/bs";

const MeetingSideBar = () => {

    const [expanded, setExpanded] = useState(false);

    return (

        <div className="h-screen flex flex-col md:flex md:block justify-end bg-gray-800">
			<div className="h-full flex flex-col border-r shadow-sm bg-gray-800">
				<div className="border-b border-gray-600 flex px-6 py-2 items-center shadow-xl">
					<button
						onClick={() => setExpanded((curr) => !curr)}
						className="p-0 p-0 rounded-lg focus:outline-none"
					>
						{expanded ? <div className='tooltip tooltip-bottom ' data-tip="Hide members"><BsCalendarEvent /></div> :
							<div className='tooltip tooltip-bottom' data-tip="Show members"><BsCalendarEvent /></div>
						}
					</button>
					<p className={`ml-3 text-white overflow-hidden transition-all ${expanded ? "w-54" : "w-0"
						}`}>Upcoming Meetings</p>
				</div>
				<div
					className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-64" : "w-0"}
          `}
				>
					<div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
						{/* Everything in the sidebar */}
						
							<p className='text-gray-300 p-4 md:block ' style={{ fontFamily: 'Rockwell, sans-serif', fontSize: '0.8 em', lineHeight: '1.4', textAlign: 'center' }}>
								<br className="md:hidden lg:inline" />
								You have no upcoming meetings</p>
						
					</div>
					{/* inside the sidebar ends here */}
				</div>
			</div>
		</div >





    )

}

export default MeetingSideBar;