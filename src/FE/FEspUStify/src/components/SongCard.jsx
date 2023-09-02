import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import PlayPause from './PlayPause';
import { playPause, setActiveSong } from "../redux/features/playerSlice";

import Error from "./Error";
import Loader from "./Loader";

import { usePlaySongMutation } from "../redux/services/CoreApi";



import Na from '../assets/bg1.jpeg';
const SongCard = ({ song, isPlaying, activeSong, index, data, handlePauseClick, handlePlayClick }) => {

 
  return (

  
    <div className='flex flex-col w-[165px] h-[250px] animate-slideup rounded-md cursor-pointer shadow-xl  relative '>
      <div className='rounded-md  relative h-[175px] w-full group bg-cover bg-no-repeat bg-center'> 
      <div className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${activeSong?.name === song.name ? 'flex bg-black bg-opacity-70' : 'hidden'}`}>
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
        <img 
          // src={song.images?.coverart} 
          src = {`http://127.0.0.1:8000${song.avatar }`}
          alt='song_img' 
          className='object-cover w-full h-full overflow-hidden '/>
       </div> 

      <div className='   w-full h-[80px] mb-0 flex flex-col relative    '>


<div className="relative w-full h-full ">
  <div
    className="absolute inset-0 bg-center bg-cover bg-no-repeat "
    style={{
      backgroundImage: `url(http://127.0.0.1:8000${song.avatar })`,
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

<div className="  mt-4 ml-2 absolute inline-flex p-[10px 30px 1px 1px] flex-col justify-end items-start ">
<p className='max-w-[150px] font-bold z-100 text-lg text-gray-100 truncate'>
  {/* QUA PAGE SONG DETAILS */}
          <Link to={`/songs/${song?.id}`}>
            
            {song.name}
          </Link>
        </p>
        <p className=' text-xs truncate text-gray-300 '>
          {/* QUA PAGE ARTIST DETAIL */}
          <Link to={song.main_artist
            ? `/artists/${song?.main_artist.id}`
            : '/top-artists'}
          >
            {song?.main_artist.artist_name}
            
          </Link>
        </p>
</div>
      
      </div>
     
    </div>
  );
};

export default SongCard;