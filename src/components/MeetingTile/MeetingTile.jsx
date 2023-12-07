import { useEffect, useState } from "react"
import { getMeetingById } from "../../services/meetings.service";
import { useNavigate, useParams } from 'react-router';
import { BsCalendarEvent } from "react-icons/bs";
import moment from "moment";

const MeetingTile = ({ meetingId }) => {

  const [currentMeeting, setCurrentMeeting] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log('getting meetingId')

    getMeetingById(meetingId)
      .then(meeting => setCurrentMeeting({ ...meeting }))

  }, [meetingId])

  return (
    <div className="tooltip tooltip-top" data-tip={currentMeeting.topic}>
      <div className="flex m-3 rounded-xl p-3 mb-0 relative bg-gray-700 hover:bg-gray-600 cursor-pointer items-center" onClick={() => navigate(`/meetings/${meetingId}`)}>
        <div className="mr-3 text-gray-300">
          <BsCalendarEvent />
        </div>
        <div className="truncate">
          <div className="flex justify-left text-white content-center truncate">
            <h2>{currentMeeting.topic}</h2>
          </div>
          <span className="text-xs justify-left text-gray-300 hidden sm:flex">Start: {moment(currentMeeting.start).calendar()}</span>
          <span className="text-xs justify-left text-gray-300 hidden sm:flex">End: {moment(currentMeeting.end).calendar()}</span>
        </div>
      </div>
    </div>
  )
}

export default MeetingTile;
