import Gif from "./Gif";


const GifGrid = ({ gifs, setPicURL }) => {


  return (
    <div className="grid grid-cols-2 bg-opacity-0 rounded overflow-y-scroll custom-scrollbar" style={{ width: '500px', height: '300px' }}>
      {gifs.map((gif) => (
        <Gif key={gif.id} url={gif.images.downsized.url} setPicURL={setPicURL} />
      ))}
    </div>
  );
};


export default GifGrid;