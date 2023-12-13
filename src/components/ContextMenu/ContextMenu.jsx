import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import { getLiveUserInfo } from "../../services/users.service";
import AlertModal from "../AlertModal/AlertModal";

const ContextMenu = ({ teamId, channelList, owner, isOwner, contextMenuVisible, setContextMenuVisible, showModal, setShowModal, channelId, member, groupDmId, setShowDeleteModal }) => {

  const { userData } = useContext(AppContext)

  const [showAlert, setShowAlert] = useState(false);
  const [command, setCommand] = useState('');
  const [currentUser, setCurrentUser] = useState(userData);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modal = document.getElementById('context-menu');
      if (modal && !modal.contains(event.target)) {
        setContextMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setContextMenuVisible]);

  useEffect(() => {
    const unsubscribe = getLiveUserInfo(data => { setCurrentUser({ ...data }) }, userData.handle);

    return () => unsubscribe();
  }, [userData]);

  return (
    <>
      <div id="context-menu" >
        <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box" >
          {(currentUser.handle === owner && !channelId)
            ? <li onClick={() => {
              setShowModal(true);
              setContextMenuVisible(false);
            }} ><a>Edit Team</a></li>
            : null}
          {((Object.keys(currentUser.teams)).includes(teamId) && !channelList) && <li onClick={() => { setShowAlert(true); setCommand('leave this team'); }}><a>Leave Team</a></li>}

          {((currentUser.myTeams ? Object.keys(currentUser.myTeams).includes(teamId) : null) && channelId && currentUser.handle !== member)
            ? <li onClick={() => { setShowAlert(true); setCommand('remove member from team'); }}><a>Remove from Team</a></li>
            : null}
          {groupDmId ? <li onClick={() => { setShowAlert(true); setCommand('leave group chat'); }}><a>Leave Group</a></li> : null}
          {channelId && channelList && !isOwner ? <li onClick={() => setShowDeleteModal(true)}><a>Leave Channel</a></li> : null}
          {channelId && channelList && isOwner ? <li onClick={() => setShowDeleteModal(true)}><a>Remove Channel</a></li> : null}
        </ul>
        {showAlert ? <AlertModal groupDmId={groupDmId} member={member} teamId={teamId} showAlert={setShowAlert} command={command} setContextMenuVisible={setContextMenuVisible} contextMenuVisible={contextMenuVisible} /> : null}
      </div>
    </>
  );
};

export default ContextMenu;
