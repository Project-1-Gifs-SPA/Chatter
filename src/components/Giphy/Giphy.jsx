import { useState } from "react";
import { getSearchGifs, getTrendingGifs } from "../../services/giphy.service";
import { useEffect } from "react";
import GifGrid from "./GifGrid";

const Giphy = () => {

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

},[search])



    return (


        <div className='p-3 m-3 flex flex-col justify-end rounded w-[100vh] h-[auto]'>
      <form onSubmit={(e)=>{e.preventDefault(); setSearch(true)}} className="flex items-end mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search for gifs"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-r-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </form>
      <GifGrid gifs={gifs} />
    </div>
  );
};

export default Giphy;