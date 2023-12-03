import { useParams } from "react-router"
import SideBar from "../../components/SideBar/SideBar"
import MyServers from "../../components/MyServers/MyServers"
import ChatBox from "../../components/ChatBox/ChatBox"
import TeamSidebar from "../../components/TeamSidebar/TeamSidebar"

const MainPage = () => {
  return (
    <div className="font-sans antialiased h-screen flex overflow-x-hidden">
      <SideBar /> {/* Adjust width as needed */}
      <MyServers /> {/* Adjust width as needed */}
      <ChatBox /> {/* Adjust width as needed */}
      <TeamSidebar /> {/* Adjust width as needed */}
    </div>
  )
}
export default MainPage;