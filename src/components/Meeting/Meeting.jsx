import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import AppContext from "../../context/AppContext";
import { addMemberToCall } from "../../services/calls.service";
import { addMeetingDescription, getLiveMeetingInfo } from "../../services/meetings.service";
import { getUserByHandle } from "../../services/users.service";
import AlertModal from "../AlertModal/AlertModal";
import ChatBox from "../ChatBox/ChatBox";
import ChatTopBar from "../ChatTopBar/ChatTopBar";
import MeetingCall from "../MeetingCall/MeetingCall";
import TeamMember from "../TeamMember/TeamMember";

const Meeting = () => {

  const { userData } = useContext(AppContext);

  const { meetingId } = useParams();

  const [currentMeeting, setCurrentMeeting] = useState({});
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [isAddDescription, setIsAddDescription] = useState(false);
  const [description, setDescription] = useState(currentMeeting?.description);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const unsubscribe = getLiveMeetingInfo(snapshot => setCurrentMeeting({ ...snapshot }), meetingId);

    return () => unsubscribe();
  }, [meetingId]);

  useEffect(() => {
    if (loading) {
      addMemberToCall(data => {
        setToken(data);
        setLoading(false);
        navigate(`/meetings/${meetingId}/room/${currentMeeting.room}`);
      }
        , currentMeeting.room, userData);
    }
  }, [loading]);

  useEffect(() => {
    if (currentMeeting.members) {
      const promises = Object.keys(currentMeeting.members).map(member =>
        getUserByHandle(member)
          .then((snapshot) => snapshot.val())
          .catch((e) => console.error(e)));

      Promise.all(promises)
        .then((membersData) => setMembers((membersData)))
        .catch((e) => console.error(e));
    }
  }, [currentMeeting.members]);

  const handleDescription = (e) => {
    e.preventDefault();

    addMeetingDescription(meetingId, description)
      .then(() => {
        setDescription('');
        setIsAddDescription(false);
      })
      .catch((e) => console.error(e));
  };

  return (
    <>
      <div className="flex-1 flex flex-col bg-gray-700 ">
        <ChatTopBar meeting={currentMeeting} />
        {roomId ?
          <div style={{ height: '50vh', width: 'auto' }} >
            <MeetingCall token={token} />
          </div>

          : <div className="flex gap-24 ml-5 text-gray-200">
            <div>
              <div className="flex">
                <h1 className="font-bold">Description</h1>
                <FaRegEdit className='ml-2 mt-1 text-[15px] text-gray-400 cursor-pointer'
                  onClick={() => setIsAddDescription(true)}
                />
              </div>
              {currentMeeting.description && !isAddDescription ? <p>{currentMeeting.description}</p> : <div className="tooltip tooltip-top" data-tip='Add description'>
                <div className="flex">
                  <p> Add description for what's to come in this meeting</p>

                </div>
              </div>}

              {isAddDescription &&
                <div>
                  <div>
                    <textarea
                      type="text"
                      className='textarea textarea-info textarea-md max-w-[800px] bg-gray-700 border-none-active px-4 py-2 text-white rounded-md xs:w-[30%] sm:w-[50%] md:w-[70%] lg:w-[90%] xl:w-[800px]'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      autoFocus // Autofocus on the input field when editing starts
                    />

                    <div className='flex'>
                      <p className='text-sm text-green-500 mr-5 cursor-pointer' style={{ fontWeight: 'bold' }}
                        onClick={handleDescription}
                      >
                        Save
                      </p>
                      <p className='text-sm text-red-500 cursor-pointer' style={{ fontWeight: 'bold' }}
                        onClick={() => setIsAddDescription(false)}
                      >
                        Discard
                      </p>
                    </div>
                  </div>
                </div>}
              <br />
              <p className="font-bold">Meeting Start:</p> <span>{moment(currentMeeting.start).calendar()}</span>
              <p className="font-bold">Meeting End:</p> <span>{moment(currentMeeting.end).calendar()}</span>
              <br />
              <div className="flex items-center mt-2">
                <button className="btn btn-sm border-none bg-green-500 text-white px-4 py-2 rounded-md transition-colors duration-300 hover:bg-green-600" onClick={() => setLoading(true)}>Join Call</button>
                <button className="btn btn-sm border-none bg-red-500 text-white px-4 py-2 ml-3 rounded-md transition-colors duration-300 hover:bg-red-600 " onClick={() => setShowAlert(true)}>Leave Meeting</button>
              </div>
            </div>
            {showAlert && <AlertModal showAlert={setShowAlert} command={"leave this meeting"} meetingId={meetingId} />}
            <br />
            <div className='border border-gray-600 p-4 rounded-xl'>
              <h1 className="font-bold">Invited</h1>
              <div className=" grid grid-cols-2">
                {members.map(member => <TeamMember key={member.uid} member={member} />)}
              </div>

            </div>
          </div>}
        <ChatBox />
      </div>

    </>
  );
};

export default Meeting;
