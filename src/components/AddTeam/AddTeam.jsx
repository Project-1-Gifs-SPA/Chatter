import React, { useState, useEffect, useContext, useRef } from "react";
import { GoPlus } from "react-icons/go";
import { addTeam, findTeamByName } from "../../services/teams.service";
import AppContext from "../../context/AppContext";
import { useNavigate } from 'react-router-dom';
import { MAX_TEAMNAME_LENGTH, MIN_TEAMNAME_LENGTH } from "../../common/constants";

const AddTeam = () => {
  const modalRef = useRef(null)
  const { userData } = useContext(AppContext);

  const [teamName, setTeamName] = useState('');
  const [teamError, setTeamError] = useState('');

  const navigate = useNavigate();

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
            navigate(`/teams/${teamId}`)
          })
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
        <dialog ref={modalRef} id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">
              Enter Team name
            </p>
            <input type='text' value={teamName} onChange={(e) => setTeamName(e.target.value)} /><br />
            <span className="bg-red">{teamError}</span>

            <div className="modal-action">

              <form method="dialog" >

                {/* if there is a button in form, it will close the modal */}
                <button className="btn mr-5" onClick={createTeam}>Add Team</button>
                <button className="btn">Close</button>
              </form>

            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default AddTeam;
