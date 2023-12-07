



const Gif = ({ url, setPicURL }) => {
    return (
      <div className="w-[auto] p-2">
        <img src={url} alt="gif" className=" w-[200px] h-[120px] rounded-lg" onClick={(e)=>{e.preventDefault(); setPicURL(url)}} />
      </div>
    );
  };


  export default Gif;