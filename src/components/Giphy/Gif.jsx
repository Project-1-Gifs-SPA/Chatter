



const Gif = ({ url }) => {
    return (
      <div className="w-1/3 p-2">
        <img src={url} alt="gif" className=" w-20 h-30 rounded-lg" />
      </div>
    );
  };


  export default Gif;