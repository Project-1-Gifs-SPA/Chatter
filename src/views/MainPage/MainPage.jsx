import { useParams } from "react-router"
import SideBar from "../../components/SideBar/SideBar"
import MyServers from "../../components/MyServers/MyServers"
import ChatBox from "../../components/ChatBox/ChatBox"
import TeamSidebar from "../../components/TeamSidebar/TeamSidebar"
import Dashboard from "../Dashboard/Dashboard"
import MeetingCall from "../../components/MeetingCall/MeetingCall"
import Meeting from "../../components/Meeting/Meeting"
const MainPage = () => {


  const{teamId,dmId, meetingId} = useParams()

  return (
    <div className="font-sans antialiased h-screen flex overflow-x-hidden">

      <SideBar /> {/* Adjust width as needed */}
      {!meetingId &&<MyServers />} {/* Adjust width as needed */}
      {teamId|| dmId ? <ChatBox /> : meetingId? <Meeting /> : <Dashboard /> }
      {teamId || dmId ? <TeamSidebar />: null } {/* Adjust width as needed */}


    </div>
  )
}
export default MainPage;
