import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import AppContext from '../../context/AppContext';
import { getLiveIsDMSeen } from '../../services/dms.service';
import { getUserByHandle } from '../../services/users.service';
import ContextMenu from '../ContextMenu/ContextMenu';
import ProfileModal from '../ProfileModal/ProfileModal';

const TeamMember = ({ member, owner, dmPartner, dmId }) => {

  const { userData } = useContext(AppContext);

  const { teamId, channelId } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [partner, setPartner] = useState({});
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [isDmSeen, setIsDmSeen] = useState([]);
  const navigate = useNavigate();
  const [arialDM, setArialDM] = useState(`private chat with ${dmPartner}`);

  useEffect(() => {
    getUserByHandle(dmPartner)
      .then(response => response.exists() ? setPartner({ ...response.val() }) : null)
      .catch((e) => console.error(e));
  }, [dmId, dmPartner]);

  const handleContextMenu = (e) => {
    if (dmId) { return; }

    e.preventDefault();
    setContextMenuVisible(true);
  };

  useEffect(() => {
    const unsubscribe = getLiveIsDMSeen(data => {
      setIsDmSeen(data);
    }, dmId);

    return () => {
      unsubscribe();
    }
  }, [dmId]);

  return (
    <>
      <div className={`flex p-3 relative ${(dmId && !isDmSeen.includes(userData.handle)) && 'bg-gradient-to-r from-purple-700 to-gray-800'}`} onClick={dmId ? () => navigate(`/dms/${dmId}`) : null}
        onContextMenu={handleContextMenu}
        aria-label={!channelId ? arialDM : null}>
        {member ? member.handle === owner && (<p className="absolute top-2 left-8 transform -translate-x-1/2 -translate-y-1/2 tooltip tooltip-right" data-tip='Team owner'>👑</p>) : null}
        <div className={`avatar ${member ? member.availability : partner.availability} relative z-[0]`}>

          <div className="w-10 rounded-full">
            <img src={member ? member.photoURL : partner.photoURL} alt="User Avatar"
              onClick={() => setShowModal(true)} />
          </div>
        </div>
        <div className="leading-4 pl-3 text-white">
          <h4 className="font-semibold hidden sm:flex">{member ? member.firstName : partner.firstName} {member ? member.lastName : partner.lastName}</h4>
          <span className="text-xs text-white hidden sm:flex">{member ? member.handle : partner.handle}</span>
        </div>
        {contextMenuVisible ? <div className='absolute top-10 left-0 z-[20]'> <ContextMenu teamId={teamId} channelId={channelId} contextMenuVisible={contextMenuVisible} setContextMenuVisible={setContextMenuVisible}
          owner={owner} member={member.handle} /></div> : null}
      </div >

      {showModal && (

        <div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
          <div className='w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] flex flex-col'>
            <ProfileModal isVisible={showModal} onClose={() => setShowModal(false)} profile={member ? member : partner} />
          </div>
        </div>
      )}
    </>
  );
};

export default TeamMember;
