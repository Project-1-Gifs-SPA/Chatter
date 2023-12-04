import { useParams } from "react-router"
import ChatBox from "../../components/ChatBox/ChatBox"
import MyServers from "../../components/MyServers/MyServers"
import SideBar from "../../components/SideBar/SideBar"
import TeamSidebar from "../../components/TeamSidebar/TeamSidebar"
import Dashboard from "../Dashboard/Dashboard"

const MainPage = () => {

  const { teamId, dmId } = useParams()

  return (
    <div className="font-sans antialiased h-screen flex overflow-x-hidden">
      <SideBar />
      <MyServers />
      {teamId || dmId ? <ChatBox /> : <Dashboard />}
      {teamId || dmId ? <TeamSidebar /> : null}
    </div>
  )
}
export default MainPage;
