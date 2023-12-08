import { useEffect, useState } from "react"
import { getMeetingById } from "../../services/meetings.service"
import moment from "moment"
import { BsCalendarEvent } from "react-icons/bs"
import { getCallRecordingDownloadURL } from "../../services/calls.service"


const MeetingsArchiveTile = ({meetingId, callId}) => {

    const [pastMeeting, setPastMeeting] = useState({})
    const [recording, setRecording] = useState('');


    useEffect(() => {
        console.log('getting meetingId')
    
        getMeetingById(meetingId)
          // .then(meeting => moment(meeting.start).isBefore(moment()) ? console.log(meeting.start) : setCurrentMeeting({ ...meeting }))
          .then(meeting => moment(meeting.start).isBefore(moment()) ? setPastMeeting({...meeting}): null)

      }, [meetingId])

      useEffect(()=>{
        console.log('getting call recording')

        if(callId){

        getCallRecordingDownloadURL(downloadURL=> setRecording(downloadURL), callId)
        }

      }, [callId])


    


     




    return (

      
        <div className="tooltip tooltip-top" data-tip={pastMeeting.topic}>
        <div className="flex m-3 rounded-xl p-3 mb-0 relative bg-gray-700 hover:bg-gray-600 cursor-pointer items-center">
          
          <div className="mr-3 text-gray-300">
            <BsCalendarEvent />
          </div>
          <div className="truncate">
            <div className="flex justify-left text-white content-center truncate">
              <h2>{pastMeeting.topic}</h2>
            </div>
            <span className="text-xs justify-left text-gray-300 hidden sm:flex">Ended: {moment(pastMeeting.end).calendar()}</span>
            {recording
            ? <span className="text-xs justify-left text-red-500 hidden sm:flex hover:underline"><a href={recording} download>Get Recording</a></span> 
            : <span className="text-xs justify-left text-gray-300 hidden sm:flex">No recording</span>}
          </div>
          
        </div>
        
      </div>
    

    )

}



export default MeetingsArchiveTile;