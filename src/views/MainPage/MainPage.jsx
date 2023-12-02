import { useParams } from "react-router"
import ChatBox from "../../components/ChatBox/ChatBox"
import MyServers from "../../components/MyServers/MyServers"
import SideBar from "../../components/SideBar/SideBar"
import TeamSidebar from "../../components/TeamSidebar/TeamSidebar"
import MeetingCall from "../../components/MeetingCall/MeetingCall"
import Meeting from "../../components/Meeting/Meeting"


const MainPage = () => {

  const{teamId,dmId, meetingId} = useParams()





  
  return (
    <div className="font-sans antialiased h-screen flex overflow-x-hidden">
      <SideBar /> {/* Adjust width as needed */}
      {teamId||dmId ? <MyServers /> :null} {/* Adjust width as needed */}
      {teamId|| dmId ? <ChatBox /> : meetingId? <Meeting /> : null }
      {teamId || dmId ? <TeamSidebar />: null } {/* Adjust width as needed */}
    </div>
  )
}
export default MainPage;