import { useContext, useEffect, useState } from "react";
import { BsCalendarEvent } from "react-icons/bs";
import AppContext from "../../context/AppContext";
import { getLiveMeetingsByHandle } from "../../services/meetings.service";
import MeetingTile from "../MeetingTile/MeetingTile";
import MeetingsArchive from "../MeetingsArchive/MeetingsArchive";

const MeetingSideBar = () => {

  const { userData } = useContext(AppContext);

  const [expanded, setExpanded] = useState(false);
  const [userMeetings, setUserMeetings] = useState(userData.meetings ? Object.keys(userData.meetings) : []);
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    const unsubscribe = getLiveMeetingsByHandle(data => {
      setUserMeetings(data);
    }, userData.handle);

    return () => unsubscribe();
  }, [userData]);

  return (
    <div className="h-screen flex flex-col md:flex md:block justify-end bg-gray-800">
      <div className="h-full flex flex-col pb-1 bg-gray-800">
        <div className="flex mt-2 px-4 py-2 items-center">
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-0 p-0 rounded-lg focus:outline-none"
          >
            {expanded ? <div className='tooltip tooltip-bottom ' data-tip="Hide members"><BsCalendarEvent className="text-purple-500 text-lg" /></div> :
              <div className='tooltip tooltip-bottom' data-tip="Show members"><BsCalendarEvent className="text-purple-500 text-lg" /></div>
            }
          </button>
          <p className={`ml-3 text-white overflow-hidden transition-all ${expanded ? "w-54" : "w-0"
            }`}>Upcoming Meetings</p>
        </div>
        <div className={`${expanded ? 'border-t border-gray-600 py-1' : ''}`}></div>
        <div
          className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-64" : "w-0"}`}
        >
          <div className="mt-6 pt-6" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div>
              <button className="btn ml-6 mr-6 btn-active btn-primary w-[auto]"
                onClick={() => setShowArchive(!showArchive)}
              >
                Archive
              </button>
            </div>
            {showArchive ? <MeetingsArchive />
              : userMeetings ? userMeetings.map(meetingId =>

                <div className='text-gray-300 pt-3 md:block ' style={{ fontFamily: 'Rockwell, sans-serif', fontSize: '0.8 em', lineHeight: '1.4' }} key={meetingId} >
                  <MeetingTile meetingId={meetingId} />
                </div>
              )
                : <p className='text-gray-300 p-4 md:block ' style={{ fontFamily: 'Rockwell, sans-serif', fontSize: '0.8 em', lineHeight: '1.4', textAlign: 'center' }}>
                  <br className="md:hidden lg:inline" />
                  You have no upcoming meetings</p>
            }
          </div>
        </div>

      </div>
    </div >
  );
};

export default MeetingSideBar;
