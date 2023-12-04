import { useParams } from "react-router"
import SideBar from "../../components/SideBar/SideBar"
import MyServers from "../../components/MyServers/MyServers"
import ChatBox from "../../components/ChatBox/ChatBox"
import TeamSidebar from "../../components/TeamSidebar/TeamSidebar"

const MainPage = () => {

  const { teamId, dmId } = useParams()

  return (
    <div className="font-sans antialiased h-screen flex overflow-x-hidden">
      <SideBar /> {/* Adjust width as needed */}
      <MyServers /> {/* Adjust width as needed */}
      <ChatBox /> {/* Adjust width as needed */}
      <TeamSidebar />
    </div>
  )
}
export default MainPage;

// {teamId|| dmId ? <ChatBox /> : null} {/* Adjust width as needed */}
// {teamId || dmId ? <TeamSidebar />:null  } {/* Adjust width as needed *