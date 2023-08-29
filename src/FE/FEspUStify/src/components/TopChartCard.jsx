import PlayPause from "./PlayPause";
import { Link } from "react-router-dom";
const TopChartCard = ({ song, index, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => (

  
    <div className='w-full flex flex-row items-center hover:bg-gray-400/50 py-2 p-4 rounded-2xl cursor-pointer mb-2'>
      <h3 className='font-bold text-base text-gray-100 mr-3'>
        {index + 1}.
      </h3>
      <div className='flex-1 flex flex-row justify-between items-center'>
        <img 
          src = {`http://127.0.0.1:8000${song.avatar }`}
          //{song?.images?.coverart} 
          alt={song?.name} 
          className='w-20 h-20 object-cover rounded-2xl'
        />
        <div className='flex-1 flex flex-col justify-center mx-3'>
          <Link to={`/songs/${song.id}`}>
            <p className='text-gray-100 text-sm'>
              {song?.name}
            </p>
          </Link>
          <Link to={`/artists/${song?.main_artist.id}`}>
            <p className='text-gray-400 text-xs mt-1'>
             {/* {song?.subtitle} */}
             
             {song?.main_artist.artist_name}
            </p>
          </Link>
        </div>
      </div>
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseClick}
        handlePlay={handlePlayClick}
      />
    </div>
  );
export default TopChartCard;