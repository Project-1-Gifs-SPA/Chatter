import { DyteMeeting, DyteRecordingIndicator, DyteRecordingToggle } from "@dytesdk/react-ui-kit";
import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core"
import { useContext, useEffect, useState } from "react";
import MyMeeting from "../MyMeeting/MyMeeting";
import { addMemberToCall, createDyteCallRoom } from "../../services/calls.service";
import AppContext from "../../context/AppContext";
import Loader from "../Loader/Loader";
import {useNavigate} from "react-router"

const MeetingCall = ({token}) => {
    const [client, initClient] = useDyteClient();
    const[showMeeting, setShowMeeting] = useState(false)

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
    },[]);

    
  const handleClick=(e)=>{
    e.preventDefault();

    setLoading(true);   
    
  } 






    return (
        <>
        <div className="flex-1 flex flex-col bg-gray-700">



            {client? 
                 <DyteProvider value={client}>
              
                <MyMeeting />
               
                 </DyteProvider>
             : <div style={{height:'50vh', width:'auto'}}><Loader  /> </div>
                }    
        
        <div>
       
        </div>
        </div>
       
        </>
    )

    
    
}

export default MeetingCall;