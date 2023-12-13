
const Loader = () => {

  return (
    <div className='h-screen flex justify-center  bg-gray-900' >
      <span className="h-20 w-20 loading loading-spinner text-primary justify-center" style={{ position: 'absolute', height: '50%' }}></span>
    </div>
  );
};

export default Loader;
