import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import { getLiveMeetingInfo, getMeetingById } from "../../services/meetings.service";
import { getUserByHandle } from "../../services/users.service";
import { defaultPicURL } from "../../common/constants";
import ChatTopBar from "../ChatTopBar/ChatTopBar";
import TeamMember from "../TeamMember/TeamMember";
import MeetingCall from "../MeetingCall/MeetingCall";
import { addMemberToCall } from "../../services/calls.service";
import AppContext from "../../context/AppContext";
import ChatBox from "../ChatBox/ChatBox";


const Meeting = () => {

const{userData} = useContext(AppContext);
const {meetingId} = useParams();
const [currentMeeting, setCurrentMeeting] = useState({});
const [members, setMembers] = useState([]);
const[startMeeting, setStartMeeting] = useState(false);
const[loading, setLoading] = useState(false)
const[token, setToken] = useState('')
const navigate = useNavigate();
const{roomId} = useParams();

useEffect(()=> {

    console.log(meetingId)

    const unsubscribe = getLiveMeetingInfo(snapshot=> setCurrentMeeting({...snapshot}), meetingId)

    return () => unsubscribe();
  

} ,[meetingId])


useEffect(()=>{
    if(loading){

      addMemberToCall(data=> {
        setToken(data)
        // setStartMeeting(true);
        setLoading(false);
        navigate(`/meetings/${meetingId}/room/${currentMeeting.room}`)
       
      }   
        ,currentMeeting.room, userData)
    }

  },[loading])


useEffect(() => {
    if (currentMeeting.members) {
        const promises = Object.keys(currentMeeting.members).map(member => {
            return getUserByHandle(member)
                .then((snapshot) => {
                    return snapshot.val();
                });
        });

        Promise.all(promises)
            .then((membersData) => {
                setMembers((membersData));
            })
            .catch((error) => {
                console.error(error);
            });
    }

   
}, [currentMeeting.members])


console.log(members[0])

return (


    <>

<div className="flex-1 flex flex-col bg-gray-700">
<ChatTopBar meeting={currentMeeting} />
{roomId?
<div style={{height:'50vh', width:'auto'}} >
<MeetingCall  token={token} />
</div>

:<div>
<h1 className="font-bold">Description</h1>
<p>A test description for the meeting.</p>
<br />
<div>
    <h1 className="font-bold">Participants</h1>
    <div>
        {members.map(member=> <TeamMember key={member.uid} member={member} />)}
    </div>
    <button className="btn w-40" onClick={()=> setLoading(true)}>Join Call</button>
</div>
   
  
</div>}

<ChatBox />

</div>

</>
)


}

export default Meeting;