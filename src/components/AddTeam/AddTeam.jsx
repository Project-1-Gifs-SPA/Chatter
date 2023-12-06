import React, { useState, useEffect, useContext, useRef } from "react";
import { GoPlus } from "react-icons/go";
import { addTeam, findTeamByName } from "../../services/teams.service";
import AppContext from "../../context/AppContext";
import { useNavigate } from 'react-router-dom';
import { createDefaultChannel } from "../../services/channel.service";
import { MAX_TEAMNAME_LENGTH, MIN_TEAMNAME_LENGTH } from "../../common/constants";

const AddTeam = () => {
  const modalRef = useRef(null)
  const { userData } = useContext(AppContext);

  const navigate = useNavigate();

  const [teamName, setTeamName] = useState('');

  const [teamError, setTeamError] = useState('');

  const createTeam = (e) => {
    e.preventDefault();
    if (teamName.length < MIN_TEAMNAME_LENGTH || teamName > MAX_TEAMNAME_LENGTH) {
      setTeamError('Team name must be between 3 and 40 characters');
      throw new Error('Team name must be between 3 and 40 characters');

    }
    setTeamError('')
    findTeamByName(teamName)
      .then(snapshot => {
        if (snapshot.exists()) {
          setTeamError(`Team ${teamName} already exists`);
          throw new Error(`Team ${teamName} already exists`);
        }
        addTeam(userData.handle, teamName)
          .then(teamId => {
            createDefaultChannel(teamId, [userData.handle], userData.handle)
              .then(channelId => {
                navigate(`/teams/${teamId}/channels/${channelId}`)
              });
          });
      })
      .catch(e => console.log(e)) //better error handling
    // document.getElementById(modalRef.current.id).close();
    // console.log(modalRef.current.id)
  }

  return (
    <div
      className="cursor-pointer"

      onClick={() => document.getElementById("my_modal_1").showModal()}
    >
      <div className="bg-white opacity-25 h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-3xl mb-1 overflow-hidden hover:rounded-md ">
        <GoPlus className="h-10 w-10" />
        <dialog ref={modalRef} id="my_modal_1" className="modal fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">

          <div className="modal-box bg-gray-700">
            <p className="py-4 text-white">
              Enter Team name
            </p>
            <input className='rounded' type='text' value={teamName} onChange={(e) => setTeamName(e.target.value)} /><br />
            <span className="bg-red">{teamError}</span>

            <div className="modal-action">

              <form method="dialog" >
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm border-none bg-green-500 text-white mr-5 hover:bg-green-600" onClick={createTeam}>Add Team</button>
                <button className="btn btn-sm border-none bg-red-500 text-white hover:bg-red-600 ">Close</button>
              </form>
            </div>
          </div>

        </dialog>
      </div>
    </div>
  );
};

export default AddTeam;
