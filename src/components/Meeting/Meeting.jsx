import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import { addMeetingDescription, getLiveMeetingInfo, getMeetingById } from "../../services/meetings.service";
import { getUserByHandle } from "../../services/users.service";
import { defaultPicURL } from "../../common/constants";
import ChatTopBar from "../ChatTopBar/ChatTopBar";
import TeamMember from "../TeamMember/TeamMember";
import MeetingCall from "../MeetingCall/MeetingCall";
import { addMemberToCall, getCallRecordingDownloadURL } from "../../services/calls.service";
import AppContext from "../../context/AppContext";
import ChatBox from "../ChatBox/ChatBox";
import { uploadCallRecording } from "../../services/storage.service";
import moment from "moment";
import { FaRegEdit, FaRegSmile } from "react-icons/fa";
import { Picker } from "emoji-mart";


const Meeting = () => {

const{userData} = useContext(AppContext);
const {meetingId, teamId, channelId} = useParams();
const [currentMeeting, setCurrentMeeting] = useState({});
const [members, setMembers] = useState([]);
const[startMeeting, setStartMeeting] = useState(false);
const[loading, setLoading] = useState(false)
const[token, setToken] = useState('')
const navigate = useNavigate();
const{roomId} = useParams();
const[isAddDescription, setIsAddDescription] = useState(false);
const[url, setUrl] = useState('');
const [description, setDescription ] = useState(currentMeeting?.description)


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


const handleDescription = (e)=>{
	e.preventDefault();
	addMeetingDescription(meetingId, description)
	.then(()=>setIsAddDescription(false))
}

console.log(url)
return (


    <>

<div className="flex-1 flex flex-col bg-gray-700">
<ChatTopBar meeting={currentMeeting} />
{roomId?
<div style={{height:'50vh', width:'auto'}} >
<MeetingCall  token={token} />
</div>

:<div className="flex gap-24">
    <div>
<h1 className="font-bold">Description</h1>
{currentMeeting.description ? <p>{currentMeeting.description}</p> :<div className="tooltip tooltip-top" data-tip='Add description'>
                       <div className="flex">
					    <p> Add description for what's to come in this meeting</p>
						<FaRegEdit className='ml-2 mt-1 text-[15px] text-gray-400 cursor-pointer' onClick={()=> setIsAddDescription(true)} />
						</div>
					</div> }
                    {isAddDescription &&
					<div>
						<div>
							<textarea
								type="text"
								className='textarea textarea-info textarea-md max-w-[800px] bg-gray-700 border-none-active px-4 py-2 text-white rounded-md xs:w-[30%] sm:w-[50%] md:w-[70%] lg:w-[90%] xl:w-[800px]'
								value={description}
								onChange={(e)=> setDescription(e.target.value)}
								autoFocus // Autofocus on the input field when editing starts
							/>
				
							<div className='flex'>
								<p className='text-sm text-green-500 mr-5 cursor-pointer' style={{ fontWeight: 'bold' }} onClick={handleDescription}>Save</p>
								<p className='text-sm text-red-500 cursor-pointer' style={{ fontWeight: 'bold' }} onClick={()=> setIsAddDescription(false)}>Discard</p>
							</div>
						</div>
					</div>}                    
<br />
<p className="font-bold">Meeting Start:</p> <span>{moment(currentMeeting.start).calendar()}</span>
<p className="font-bold">Meeting End:</p> <span>{moment(currentMeeting.end).calendar()}</span>
<br />
<button className="btn w-40" onClick={()=> setLoading(true)}>Join Call</button>
</div>

<br />
<div>
    <h1 className="font-bold">Invited</h1>
    <div>
        {members.map(member=> <TeamMember key={member.uid} member={member} />)}
    </div>
    
</div>
   

</div>}

<ChatBox />

</div>

</>
)


}

export default Meeting;