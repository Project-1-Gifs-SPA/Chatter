import { useEffect, useState } from "react";
import { getSearchGifs, getTrendingGifs } from "../../services/giphy.service";
import GifGrid from "./GifGrid";

const Giphy = ({ setPicURL }) => {

  const [gifs, setGifs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState(false);

  useEffect(() => {
    getTrendingGifs()
      .then(data => setGifs(data))
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (search) {
      getSearchGifs(searchTerm)
        .then(data => {
          setGifs(data)
          setSearchTerm('');
          setSearch(false);
        })
        .catch((e) => console.error(e));
    }
  }, [search]);

  return (
    <div className='p-3 m-3 flex flex-col bg-gray-800 rounded w-[515px]'>

      <form className="flex items-end mb-4 text-sm"
        onSubmit={(e) => { e.preventDefault(); setSearch(true) }}
      >

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-l-lg bg-gray-700 focus:outline-none text-white"
          placeholder="Search for gifs..."
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-r-lg bg-purple-700 text-white hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Search
        </button>

      </form>

      <GifGrid gifs={gifs} setPicURL={setPicURL} />
    </div>
  );
};

export default Giphy;
