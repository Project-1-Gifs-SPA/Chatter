import { useState } from "react";
import { getSearchGifs, getTrendingGifs } from "../../services/giphy.service";
import { useEffect } from "react";
import GifGrid from "./GifGrid";

const Giphy = ({setPicURL}) => {

const [gifs, setGifs] = useState([]);
const [searchTerm, setSearchTerm] = useState('')
const [search, setSearch] = useState(false)

useEffect(()=>{

  getTrendingGifs()
  .then(data=>setGifs(data))

},[])

useEffect(()=>{
  if(search){
    getSearchGifs(searchTerm)
    .then(data=>{
      setGifs(data)
      setSearchTerm('');
      setSearch(false);
    })
  } 

},[ search])



    return (

     
        <div className='p-3 m-3 flex flex-col rounded w-[25%] h-[50%]'>
      <form onSubmit={(e)=>{e.preventDefault(); setSearch(true)}} className="flex items-end mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 focus:outline-none"
          placeholder="Search for gifs"
        />
        <button
          type="submit"
          className=" px-4 py-2 rounded-r-lg bg-purple-700 text-white hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Search
        </button>
      </form>
      <GifGrid gifs={gifs} setPicURL={setPicURL} />
    </div>
    
  );
};

export default Giphy;