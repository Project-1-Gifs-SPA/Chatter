import Gif from "./Gif";


const GifGrid = ({ gifs, setPicURL }) => {


    return (
      <div className="flex h-[auto] w-[150vh]">
        {gifs.map((gif) => (
          <Gif key={gif.id}  url={gif.images.downsized.url} setPicURL={setPicURL} />
        ))}
      </div>
    );
  };


  export default GifGrid;