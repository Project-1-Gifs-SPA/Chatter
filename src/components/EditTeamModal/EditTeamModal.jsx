import { useEffect, useRef, useState } from "react";
import { uploadTeamPhoto } from "../../services/storage.service";
import { findTeamByName, getTeamName, updateTeamName } from "../../services/teams.service";
import { MAX_TEAMNAME_LENGTH, MIN_TEAMNAME_LENGTH } from "../../common/constants";
import { IoIosPeople } from "react-icons/io";
import defaultTeamPic from "../../assets/team-default-pic.png";



const EditTeamModal = ({ teamId, onClose, name, teamPic }) => {

    const [newName, setNewName] = useState(name)
    const [nameError, setNameError] = useState('Team Name')

    useEffect(() => {
        const handleClickOutside = (event) => {
            const modal = document.getElementById('myModal');
            if (modal && !modal.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [fileName, setFileName] = useState('');

    const handlePhoto = () => {
        uploadTeamPhoto(photo, teamId, setLoading)
            .then(() => {
                setFileName('');
                onClose();
            })
    }

    const handleChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (e.target.files[0] !== null) {
            setFileName(file.name);
            setPhoto(e.target.files[0]);
        }
    }

    const handleChangeName = (e) => {
        e.preventDefault()
        if (newName.length < MIN_TEAMNAME_LENGTH || newName.length > MAX_TEAMNAME_LENGTH) {
            setNameError('Team name must be between 3 and 40 characters');
            throw new Error('Team name must be between 3 and 40 characters');

        }
        setNameError('Team Name');
        findTeamByName(newName)
            .then(snapshot => {
                if (snapshot.exists()) {
                    setNameError(`Team ${newName} already exists`);
                    throw new Error(`Team ${newName} already exists`);
                }

                updateTeamName(teamId, newName)
                    .then(() => onClose());
            })
    }

    function handleDiscardChanges() {
        setNewName(name);
        setPhoto(null);
        setFileName('');
    }

    return (

        <div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
            <div id='myModal' className='w-[550px] flex flex-col'>
                <div className='bg-gray-900 p-2 rounded-xl h-[350px]'>

                    {/* Avatar section */}
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col md:flex-row space-y-6 md:space-x-6">
                            <div className="flex items-center">
                                <div className="w-20 rounded-full">
                                    <img src={teamPic ? teamPic : defaultTeamPic} className="rounded-full mb-1 bg-blend-normal" alt="User Avatar" />
                                </div>
                            </div>
                            <div className="w-full flex flex-col justify-center">
                                <input className="bg-white py-1 px-2 rounded-lg cursor-pointer text-sm" onClick={() => inputRef.current.click()} placeholder={fileName === '' ? "Choose between .jpg, .png" : fileName} />
                                <input className="hidden" ref={inputRef} type='file' accept="image/jpeg, image/png, image/jpg" onChange={handleChange} />
                                <div>
                                    <button className="btn btn-primary btn-sm w-15 mt-2 text-sm" onClick={() => inputRef.current.click()}>Choose File</button>
                                    <button className="btn btn-success btn-sm text-white w-25 mt-2 ml-3 text-sm" disabled={loading || !photo} onClick={handlePhoto}>Change picture</button>
                                </div>
                            </div>

                        </div>
                        <div className="flex-col ml-10 pr-0 align-top " >
                            <div className="form-control pl-7 ml-10">
                                <label className="form-label text-white">{nameError}</label>
                                <input
                                    className="input input-bordered w-[300px]"
                                    style={{ backgroundColor: 'white' }}
                                    maxLength="35"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    // placeholder={currentUser.firstName}
                                    type="text"
                                />
                                <div>
                                    <button className="btn btn-primary btn-sm border-none bg-green-500 text-white px-4 py-2 rounded-md transition-colors duration-300 hover:bg-green-600 mt-3"
                                        onClick={handleChangeName}
                                    >
                                        Save name
                                    </button>
                                    <button
                                        onClick={handleDiscardChanges}
                                        className="btn btn-sm border-none bg-red-500 text-white px-4 py-2 ml-3 rounded-md transition-colors duration-300 hover:bg-red-600 "
                                    >
                                        Discard changes
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </div >


    )
}

export default EditTeamModal;