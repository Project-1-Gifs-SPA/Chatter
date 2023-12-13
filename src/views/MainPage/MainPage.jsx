import { useParams } from "react-router";
import ChatBox from "../../components/ChatBox/ChatBox";
import Meeting from "../../components/Meeting/Meeting";
import MyServers from "../../components/MyServers/MyServers";
import SideBar from "../../components/SideBar/SideBar";
import TeamSidebar from "../../components/TeamSidebar/TeamSidebar";
import Dashboard from "../Dashboard/Dashboard";

const MainPage = () => {

  const { teamId, dmId, meetingId } = useParams();

  return (
    <div className="font-sans antialiased h-screen flex overflow-x-hidden">
      <SideBar />
      {!meetingId && <MyServers />}
      {teamId || dmId ? <ChatBox /> : meetingId ? <Meeting /> : <Dashboard />}
      {teamId || dmId ? <TeamSidebar /> : null}
    </div>
  );
};

export default MainPage;
