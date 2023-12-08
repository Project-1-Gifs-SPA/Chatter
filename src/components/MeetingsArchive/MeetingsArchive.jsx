import { useEffect, useState } from "react"
import { getAllMeetings } from "../../services/meetings.service";
import moment from "moment";
import MeetingsArchiveTile from "./MeetingArchiveTile";


const MeetingsArchive = () => {

    const [allMeetings, setAllMeetings] = useState([]);

    useEffect(()=>{
        getAllMeetings()
        .then(meetings=> setAllMeetings(meetings))

    },[])

    console.log(allMeetings)

    return(

        <div>{
            allMeetings.map(meeting=>{

                if(moment(meeting.start).isBefore(moment())){
                  return (
                  <div key={meeting.id}>

                    <MeetingsArchiveTile meetingId={meeting.id} callId={meeting.room} />

                  </div>)
                  
                 
                }

            })
            
            
            
            }</div>


    )


}

export default MeetingsArchive;