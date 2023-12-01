import { DyteMeeting, DyteRecordingIndicator, DyteRecordingToggle } from "@dytesdk/react-ui-kit";
import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core"
import { useContext, useEffect, useState } from "react";
import MyMeeting from "../MyMeeting/MyMeeting";
import { addMemberToCall, createDyteCallRoom } from "../../services/calls.service";
import AppContext from "../../context/AppContext";
import Loader from "../Loader/Loader";
import {useNavigate} from "react-router"

const MeetingCall = () => {
    const [client, initClient] = useDyteClient();
    const[showMeeting, setShowMeeting] = useState(false)
    const[loading, setLoading] = useState(false)
    const[token, setToken] = useState('')
    const{userData} = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(()=>{
        console.log(token)
        if(token){
        initClient({
            authToken: token ,
            defaults : {
                audio: false,
                video: false
            }
        });
    
        }
        setShowMeeting(true)
    },[token]);

    
  const handleClick=(e)=>{
    e.preventDefault();

    setLoading(true);   
    
  } 


    useEffect(()=>{
        if(loading){
    
          addMemberToCall(data=> {
            setToken(data)
           
          }   
            ,"bbb16ea4-99e9-4d33-9e64-285a751d32b2", userData)
        }
    
      },[loading])



    return (
        <>
        <div className="flex-1 flex flex-col bg-gray-700">

            {client? 
                 <DyteProvider value={client}>
              
                <MyMeeting />
               
                 </DyteProvider>
             : <div className="px-6 py-4 flex-1">
                <p>You haven't join the meeting yet</p> {/* make an info component for the meeting */}
             </div>
                }    
        
        <div>
        <button className="btn" onClick={handleClick}>Join Call</button>
        </div>
        </div>
       
        </>
    )

    
    
}

export default MeetingCall;