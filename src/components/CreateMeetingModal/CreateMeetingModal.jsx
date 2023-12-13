import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { MAX_CHANNEL_LENGTH, MIN_CHANNEL_LENGTH } from "../../common/constants";
import AppContext from "../../context/AppContext";
import { createDyteCallRoom } from "../../services/calls.service";
import { createMeeting } from "../../services/meetings.service";
import SearchBarChoose from "../SearchBarChoose/SearchBarChoose";

const CreateMeetingModal = ({ setShowModal, teamMembers }) => {

  const { teamId } = useParams();

  const { userData } = useContext(AppContext);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [meetingTopic, setMeetingTopic] = useState('');
  const [members, setMembers] = useState({ [userData.handle]: true });
  const [meetingTopicError, setMeetingTopicError] = useState('Meeting Topic');
  const [check, setCheck] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();

    if (meetingTopic.length < MIN_CHANNEL_LENGTH || meetingTopic.length > MAX_CHANNEL_LENGTH) {
      setMeetingTopicError('Meeting topic must be between 3 and 40 characters');
      throw new Error('Meeting topic must be between 3 and 40 characters');
    }

    createMeeting(userData.handle, Object.keys(members), meetingTopic, startDate, endDate, teamId)
      .then(meetingId => createDyteCallRoom(meetingId, meetingTopic))
      .then(() => setShowModal(false))
      .catch((e) => console.error(e));
  };

  const addMembers = (userHandle) => setMembers({
    ...members,
    [userHandle]: !members[userHandle],
  });

  useEffect(() => {
    if (check) {
      const allMembers = {}
      teamMembers.map(member => allMembers[member.handle] = true)
      setMembers(allMembers);
    }
  }, [check]);

  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
      <div id='myModal' className='w-[550px] flex flex-col justify-center'>
        <div className='bg-gray-900 p-2 rounded-xl h-[auto]'>

          {/* Avatar section */}

          <div className="flex-col ml-10 pr-0 align-top mt-5 " >
            <div className="form-control pl-7 ml-10">
              <label className="form-label text-white">{meetingTopicError}</label>
              <input
                className="input input-bordered w-[300px]"
                style={{ backgroundColor: 'white' }}
                maxLength="35"
                value={meetingTopic}
                onChange={(e) => setMeetingTopic(e.target.value)}
                placeholder='Enter meeting topic'
                type="text"
              />
              <div>
                {/* <button  className="btn btn-primary w-15 mt-2 text-sm"
                                        >
                                            Save name
                                        </button> */}

              </div>

            </div>

          </div>
          {/* start Date */}

          <div className="flex-col ml-10 pr-0 align-top " >
            <div className="form-control pl-7 ml-10">
              <label className="form-labe">Start time</label>
              <input
                className="input input-bordered w-[300px]"
                // style={{ backgroundColor: 'white' }}
                maxLength="35"

                onChange={(e) => setStartDate(e.target.value)}

                // placeholder={currentUser.firstName}
                type="datetime-local"
              />
              <div>
                {/* <button  className="btn btn-primary w-15 mt-2 text-sm"
                                        onClick={()=>console.log(startDate)}
                                        >
                                            Save name
                                        </button> */}

              </div>

            </div>

          </div>


          {/* end date*/}

          <div className="flex-col ml-10 pr-0 align-top " >
            <div className="form-control pl-7 ml-10">
              <label className="form-labe">End time</label>
              <input
                className="input input-bordered w-[300px]"
                // style={{ backgroundColor: 'white' }}
                maxLength="35"

                onChange={(e) => setEndDate(e.target.value)}

                // placeholder={currentUser.firstName}
                type="datetime-local"
              />
              <div className=" mt-5 w-[300px]">
                <SearchBarChoose teamMembers={teamMembers} addMembers={addMembers} members={members} isMeeting={true} />
                <div className="form-control" >
                  <label className="label cursor-pointer flex justify-end">
                    <span className="label-text mr-3">Add all team members</span>
                    <input type="checkbox" checked={check} className="checkbox" onChange={() => setCheck(!check)} />
                  </label>
                </div>
              </div>
              <div className="mb-2 pl-5 ml-2">
                <button className="btn btn-primary w-15 mt-2 text-sm"
                  onClick={handleClick}
                >
                  Create meeting
                </button>
                <button className="btn btn-primary w-15 mt-2 text-sm ml-5"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                {/* <SearchBar team={teamId} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMeetingModal;
