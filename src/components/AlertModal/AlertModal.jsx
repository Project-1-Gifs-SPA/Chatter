import { useContext, useState } from "react";
import { useNavigate } from 'react-router';
import AppContext from "../../context/AppContext";
import { deleteGroupMember } from "../../services/dms.service";
import { removeMemberFromMeeting } from "../../services/meetings.service";
import { removeTeamMember } from "../../services/teams.service";

const AlertModal = ({ showAlert, command, setContextMenuVisible, teamId, member, groupDmId, meetingId }) => {

  const [action, setAction] = useState(command);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (command === 'leave this team') {
      removeTeamMember(teamId, userData.handle)
        .then(() => {
          showAlert(false);
          setContextMenuVisible(false);
        })
        .catch((e) => console.error(e));
    }

    if (command === 'remove member from team') {
      removeTeamMember(teamId, member)
        .then(() => {
          showAlert(false);
          setContextMenuVisible(false);
        })
        .catch((e) => console.error(e));
    }

    if (command === 'leave group chat') {
      deleteGroupMember(groupDmId, userData.handle)
        .then(() => {
          showAlert(false);
          setContextMenuVisible(false);
        })
        .catch((e) => console.error(e));
    }

    if (command === 'leave this meeting') {
      removeMemberFromMeeting(meetingId, userData.handle)
        .then(() => {
          showAlert(false);
          navigate('/');
        })
        .catch((e) => console.error(e));
    }
  }

  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
      <div id='myModal' className='w-[auto] flex flex-col p-10 rounded-md bg-gray-800'>

        <h3 className="font-bold text-lg text-white">Are you sure you want to {action}?</h3>

        <div className="modal-action justify-center">

          <form method="dialog " >
            <button className="btn mr-5 border-none bg-red-500 text-white hover:bg-red-600"
              onClick={() => { showAlert(false); setContextMenuVisible(false) }}
            >
              Close
            </button>

            <button className="btn border-none bg-green-500 text-white mr-5 hover:bg-green-600"
              onClick={handleClick}
            >
              Confirm
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AlertModal;
