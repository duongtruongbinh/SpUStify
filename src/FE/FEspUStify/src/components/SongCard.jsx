import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import PlayPause from './PlayPause';
import { playPause, setActiveSong } from "../redux/features/playerSlice";

import Na from '../assets/bg1.jpeg';
const SongCard = ({ song, isPlaying, activeSong, index, data }) => {

  const dispatch = useDispatch();

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, index }));
    dispatch(playPause(true));
  };

  return (

  
    <div className='flex flex-col w-[165px] h-[250px] animate-slideup rounded-md cursor-pointer shadow-xl  relative '>
      <div className='rounded-md  relative h-[175px] w-full group bg-cover bg-no-repeat bg-center'> 
       
        <img 
          // src={song.images?.coverart} 
          src = {Na}
          alt='song_img' 
          className='object-cover w-full h-full overflow-hidden '/>
       </div> 

      <div className='   w-full h-[80px] mb-0 flex flex-col relative    '>


<div className="relative w-full h-full ">
  <div
    className="absolute inset-0 bg-center bg-cover bg-no-repeat "
    style={{
      backgroundImage: `url(${Na})`,
    }}
  />
  <div className="absolute inset-0 bg-black opacity-40 " />
  <div
    className="  absolute inset-0 bg-cover bg-no-repeat bg-center blur-[28px]"
    style={{
      //backgroundImage: `url(${Na})`,
      backdropFilter: 'blur(28px)',
    }}
  />
  
</div>

<div className=" mt-4 ml-2 absolute inline-flex p-[10px 30px 1px 1px] flex-col justify-end items-start ">
<p className='  font-bold z-100 text-lg text-gray-100 truncate'>
          <Link to={`/songs/${song?.id}`}>
            {song.name}
          </Link>
        </p>
        <p className=' text-xs truncate text-gray-300 '>
          <Link to={song.song_artists
            ? `/artists/${song?.song_artists[0]?.adamid}`
            : '/top-artists'}
          >
            {song.song_artists[0]}
          </Link>
        </p>
</div>
      
      </div>
     
    </div>
  );
};

export default SongCard;