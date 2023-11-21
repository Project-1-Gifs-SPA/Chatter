import ChatBox from "../../components/ChatBox/ChatBox"
import MyServers from "../../components/MyServers/MyServers"
import SideBar from "../../components/SideBar/SideBar"

const MainPage = () => {

  return (
    <div className="font-sans antialiased h-screen flex">
      <SideBar />
      <MyServers />
      <ChatBox />
    </div>
  )
}
export default MainPage;