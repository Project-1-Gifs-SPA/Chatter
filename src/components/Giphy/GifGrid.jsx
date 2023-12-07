import Gif from "./Gif";


const GifGrid = ({ gifs }) => {


    return (
      <div className="flex h-[auto] w-[100vh]">
        {gifs.map((gif) => (
          <Gif key={gif.id}  url={gif.images.fixed_width.url} />
        ))}
      </div>
    );
  };


  export default GifGrid;