import { DyteButton, DyteGrid, DyteMeeting, DyteRecordingIndicator, DyteRecordingToggle } from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core"
import { useEffect } from "react";
import {useNavigate} from "react-router"

const MyMeeting = () => {


    const{ meeting } = useDyteMeeting();
    const navigate = useNavigate();
    // const roomJoined = useDyteSelector((m) => m.self.roomJoined);

    // if(!roomJoined){
    //     return(
    //         <div>
    //             <p>You haven't join the room yet.</p>
    //             <DyteButton onClick={()=>meeting.joinRoom()}>Join Room</DyteButton>
    //         </div>
    //     );
    // }

    useEffect(()=>{
        meeting.self.on('roomLeft', ()=>{

            navigate('/welcome');
        })

    },[meeting])

    return(

        <div style={{height:'100vh', widows:'100vw'}}>
           
            <DyteMeeting 
            mode='fill'
            meeting={meeting}
            showSetupScreen={false}
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