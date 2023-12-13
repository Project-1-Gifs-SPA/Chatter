import { useContext, useEffect, useState } from "react";
import { IoIosPeople } from "react-icons/io";
import { useNavigate } from 'react-router';
import AppContext from "../../context/AppContext";
import { getDMById, getLiveGroupDMsMembers, getLiveIsDMSeen } from "../../services/dms.service";
import { getUserByHandle } from "../../services/users.service";
import ContextMenu from "../ContextMenu/ContextMenu";
import './GroupDmTile.css';

const GroupDmTile = ({ groupDmId }) => {

  const { userData } = useContext(AppContext);

  const [partners, setPartners] = useState([]);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [isDmSeen, setIsDmSeen] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = getLiveIsDMSeen(data => {
      setIsDmSeen(data);
    }, groupDmId);

    return () => {
      unsubscribe();
    };
  }, [groupDmId]);

  useEffect(() => {
    if (groupDmId) {
      getDMById(groupDmId)
        .then(snapshot => {
          const data = snapshot.exists() ? snapshot.val() : {};
          return data.members;
        })
        .then(dmMembers => {

          const promises = Object.keys(dmMembers).map(member =>
            getUserByHandle(member)
              .then((snapshot) => snapshot.val())
              .catch((e) => console.error(e)));

          Promise.all(promises)
            .then((membersData) => setPartners(membersData))
            .catch((e) => console.error(e));
        });
    }
  }, [groupDmId]);

  useEffect(() => {
    const unsubscribe = getLiveGroupDMsMembers(data => {
      const promises = Object.keys(data).map(member =>
        getUserByHandle(member)
          .then((snapshot) => snapshot.val())
          .catch((e) => console.error(e))
      );

      Promise.all(promises)
        .then((membersData) => setPartners(membersData))
        .catch((e) => console.error(e));
    }, groupDmId);

    return () => {
      unsubscribe();
    }
  }, [groupDmId]);

  const handleContextMenu = (e) => {
    e.preventDefault();

    setContextMenuVisible(true);
  }

  return (
    <div className="tooltip tooltip-top" data-tip={partners.map(partner => partner.firstName)} onContextMenu={handleContextMenu}>
      <div className={`flex p-3 mb-0 relative hover:bg-gray-700 cursor-pointer ${(groupDmId && !isDmSeen.includes(userData.handle)) && 'bg-gradient-to-r from-purple-700 to-gray-800'}`} onClick={() => navigate(`/dms/${groupDmId}`)}>

        <div className="w-10 rounded-full bg-green-700 mr-3">
          <IoIosPeople className="w-10 h-10" />
        </div>
        <div className="truncate">
          <div className="flex justify-left content-center">

            {partners.map(partner => {
              return (
                <div key={partner.uid} className=" pr-1  text-white ">
                  <h4 className="font-semibold hidden sm:flex">{partner.firstName},</h4>
                </div>
              )
            })}
          </div>
          <span className="text-xs justify-center text-white hidden sm:flex">{partners.length} members</span>
        </div>
      </div>
      {contextMenuVisible ? <ContextMenu groupDmId={groupDmId} contextMenuVisible={contextMenuVisible} setContextMenuVisible={setContextMenuVisible} /> : null}

    </div>
  );
};

export default GroupDmTile;
