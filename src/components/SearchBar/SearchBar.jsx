import React, { useContext, useEffect, useState } from 'react'
import { getAllUsers, getUsersBySearchTerm } from '../../services/users.service';
import TeamMember from '../TeamMember/TeamMember';
import { IoIosArrowDown } from "react-icons/io";
import { BsPersonFillAdd } from "react-icons/bs";
import { addTeamMember } from '../../services/teams.service';
import AppContext from '../../context/AppContext';

const SearchBar = ({ team }) => {
	const { userData } = useContext(AppContext)
	const [allUsers, setAllUsers] = useState([]);
	const [searchParam, setSearchParam] = useState("handle");
	const [searchTerm, setSearchTerm] = useState("");
	const [searchedUsers, setSearchedUsers] = useState([]);

	useEffect(() => {
		getAllUsers()
			.then((r) => {
				setAllUsers([...r].sort((a, b) => b.createdOn - a.createdOn));
			})
	}, []);

	const handleAddMember = (user) => {
		addTeamMember(user, team.id)
	}

	const handleSearchTerm = (e) => {
		const searchTerm = e.target.value.toLowerCase();
		setSearchTerm(searchTerm);

		setSearchedUsers(getUsersBySearchTerm(allUsers, searchParam, searchTerm));
	};

	return (
		<>
			<div>
				<form className='pl-2 pr-2 pt-8 pb-3'>
					<div className="flex items-center">
						<input
							type="search"
							placeholder={`Search by ${searchParam === 'handle' ? 'username' : searchParam}...`}
							className='flex-grow h-7 p-4 rounded-full bg-slate-700 text-gray-200'
							onChange={handleSearchTerm}
						/>
						<div className="dropdown dropdown-hover dropdown-end">
							<label className="h-7 w-7 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 cursor-pointer" tabIndex={0} ><IoIosArrowDown /></label>
							<ul className="dropdown-content z-[1] menu p-2 shadow bg-gray-600 rounded-box w-52" tabIndex={0}>
								<li><a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100" role="menuitem" onClick={() => setSearchParam('handle')}>By username</a></li>
								<li><a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100" role="menuitem" onClick={() => setSearchParam('email')}>By Email</a></li>
								<li><a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100" role="menuitem" onClick={() => setSearchParam('firstName')}>By First Name</a></li>
							</ul>
						</div>
					</div>
				</form>
			</div>

			{searchedUsers && <div className='w-[300px] rounded bg-gray-700 bg-opacity-90 absolute  top-24 right-9 z-50'>
				{searchedUsers.map(regUser => {
					return (
						<div key={regUser.uid} className='flex items-center'>
							<TeamMember member={regUser} />
							{team.owner === userData.handle && <BsPersonFillAdd className='cursor-pointer text-white text-xl' onClick={() => handleAddMember(regUser.handle)} />
							}

						</div>
					)
				})
				}
			</div>
			}
		</>
	)
}

export default SearchBar