import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoAdd, IoRemove } from "react-icons/io5";
import { getUsersBySearchTerm } from "../../services/users.service";
import TeamMember from "../TeamMember/TeamMember";

const SearchBarChoose = ({ addMembers, channelMembers, teamMembers, members, isMeeting }) => {

  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchParam, setSearchParam] = useState("handle");

  const handleSearchTerm = (e) => setSearchedUsers(getUsersBySearchTerm(teamMembers, searchParam, e.target.value));

  return (
    <>
      <div>
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
      </div>

      {searchedUsers && <div className='w-[auto] rounded bg-gray-700 bg-opacity-90 relative z-50'>
        {searchedUsers.map(regUser =>
          <div key={regUser.uid} className='flex items-center'>
            <TeamMember key={regUser.handle} member={regUser} />
            <div className='tooltip' data-tip='Add to channel'>
              {isMeeting ?

                members[regUser.handle]
                  ? <IoRemove className='cursor-pointer text-white text-xl ' onClick={() => addMembers(regUser.handle)} />
                  : <IoAdd className='cursor-pointer text-white text-xl ' onClick={() => addMembers(regUser.handle)} />

                : channelMembers[regUser.handle]
                  ? <IoRemove className='cursor-pointer text-white text-xl ' onClick={() => addMembers(regUser.handle)} />
                  : <IoAdd className='cursor-pointer text-white text-xl ' onClick={() => addMembers(regUser.handle)} />}
            </div>
          </div>
        )}
      </div>
      }</>
  );
};

export default SearchBarChoose;
