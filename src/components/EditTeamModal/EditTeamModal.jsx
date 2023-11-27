import { useEffect, useRef, useState } from "react";
import { uploadTeamPhoto } from "../../services/storage.service";



const EditTeamModal = ({isVisible, teamId, onClose}) =>{



    
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
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [fileName, setFileName] = useState('');


    const handleEditTeam = (e)=>{
        e.preventDefault();
        setShowModal(true)
    }

    const handlePhoto = () =>{
        uploadTeamPhoto(photo, teamId, setLoading)
        .the(()=>{
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


    if(!isVisible) return null;

    return (

        <div className='fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
        <div id='myModal' className='w-[550px] flex flex-col'>
            <div className='bg-gray-900 p-2 rounded-xl h-[660px]'>

                {/* Avatar section */}
                <div className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row space-y-6 md:space-x-6">
                        <div className="flex items-center">
                                <div className="w-20 rounded-full">
                                    <img alt="User Avatar" />
                                </div>
                        </div>
                        <div className="w-full flex flex-col justify-center">
                            <input className="bg-white py-1 px-2 rounded-lg cursor-pointer text-sm" onClick={() => inputRef.current.click()} placeholder={fileName === '' ? "Choose between .jpg, .png" : fileName} />
                            <input className="hidden" ref={inputRef} type='file' accept="image/jpeg, image/png, image/jpg" onChange={handleChange} />
                            <div>
                                <button className="btn btn-primary w-15 mt-2 text-sm" onClick={() => inputRef.current.click()}>Choose File</button>
                                <button className="btn btn-success text-white w-25 mt-2 ml-3 text-sm" disabled={loading || !photo}  onClick={handlePhoto}>Change picture</button>
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