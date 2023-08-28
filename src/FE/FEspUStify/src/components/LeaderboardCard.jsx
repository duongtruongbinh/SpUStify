import React from "react";
import Na from '../assets/Na.jpeg';
import { Link } from "react-router-dom";
import Loader from './Loader';
import Error from './Error';
import PlayPause from './PlayPause';
import Like from "./Like";
import AddPlaylist from "./AddPlaylist";


const LeaderboardCard = ({ song, index, isPlaying, activeSong, handlePauseClick, handlePlayClick,handleLikeClick }) => (
    <div className='w-full  flex flex-row items-center hover:bg-gray-400/50 py-2 p-4 rounded-2xl cursor-pointer mb-2'>
      <h3 className='font-bold text-base text-gray-100 mr-3'>
        {index + 1}.
      </h3>
      <div className="flex items-center justify-between flex-1 ">
      <div className='flex   items-center  gap-6'>
        <img 
          src = {`http://127.0.0.1:8000${song.avatar }`}
          //{song?.images?.coverart} 
          alt={song?.name} 
          className='w-20 h-20 rounded-2xl'
        />
        
          <Link to={`/songs/${song.id}`}>
            <p className='text-gray-100 text-sm'>
              {song?.name}
            </p>
          </Link>
          </div >
          <div  className="">
          <Link to={`/artists/${song?.main_artist.id}`}>
            <p className='text-gray-400 text-xs mt-1'>
             {/* {song?.subtitle} */}
             {song.main_artist.artist_name}
            </p>
          </Link>
          </div>
         
        

      <div className=" flex flex-row gap-4 "> 
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseClick}
        handlePlay={handlePlayClick}
      />

    
      </div>
      </div>
     
     
    </div>
  )
export default LeaderboardCard;