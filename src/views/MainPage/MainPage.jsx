import { useParams } from "react-router"
import ChatBox from "../../components/ChatBox/ChatBox"
import MyServers from "../../components/MyServers/MyServers"
import SideBar from "../../components/SideBar/SideBar"

const MainPage = () => {

  const{teamId} = useParams();

  return (
    <div className="font-sans antialiased h-screen flex">
      <SideBar />
      <MyServers teamId={teamId} />
      <ChatBox />
    </div>
  )
}
export default MainPage;