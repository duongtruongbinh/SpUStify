import { useNavigate } from 'react-router-dom';

const ArtistCard = ({ track }) => {

  const navigate = useNavigate();

  return (
    
    <div 
      className='flex flex-col w-[200px] p-4 animate-slideup rounded-2xl cursor-pointer'
      onClick={() => navigate(`/artists/${track?.artists[0].adamid}`)}  
    >
      <img 
        alt='artist'
        src={track?.images?.coverart}
        className='w-full h56 rounded-2xl'
      />
      <p className='mt-4 text-lg text-gray-100 truncate'>{track?.subtitle}</p>
    </div>
  );
};

export default ArtistCard;
