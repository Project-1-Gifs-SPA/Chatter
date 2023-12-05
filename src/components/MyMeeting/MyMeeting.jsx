import { DyteMeeting } from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core"
import { useEffect } from "react";
import {useNavigate, useParams} from "react-router"
import Meeting from "../Meeting/Meeting";

const MyMeeting = () => {
    

    const{meetingId} = useParams();
    const{ meeting } = useDyteMeeting();
    const navigate = useNavigate();
    const roomJoined = useDyteSelector((m) => m.self.roomJoined);

    // if(!roomJoined){
    //     return(
    //         <div>
                
    //             <DyteSetupScreen />
    //         </div>
    //     );
    // }


    useEffect(()=>{
        meeting.self.on('roomLeft', ()=>{

            navigate(`/meetings/${meetingId}`)
        })

    },[meeting])


    

    
    return(

        <div style={{height:'50vh', width:'auto'}}  >
           
            <DyteMeeting 
            mode='fill'
            meeting={meeting}
            showSetupScreen={false}
            className="bg-gray-700"    
             />
            
           
        </div>



        // <div style={{height:'100vh', widows:'100vw'}}>
        //     <DyteGrid 
        //     meeting={meeting}
        //      />
        // </div>


    )


};

export default MyMeeting;