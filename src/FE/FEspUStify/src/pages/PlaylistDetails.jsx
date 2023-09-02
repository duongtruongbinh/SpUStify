import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs ,TopChartCard} from "../components";
import PlayPause from "../components/PlayPause";
import {AiFillEdit} from 'react-icons/ai';
import { Link } from "react-router-dom";
import { setActiveSong, playPause } from "../redux/features/playerSlice";
import {
  useGetPlaylistDetailsQuery
} from "../redux/services/CoreApi";
const PlaySong = ({songData,related_song,
    
    isPlaying,
    activeSong,
    handlePauseClick,
    handlePlayClick}) => (
        <div className= "border-player_playlist  items-center flex flex-col bg-player_playlist w-[400px] h-[500px] rounded-[44px]  ">
        <p className="text-white flex justify-center mt-5 font-bold">Now playing</p>
    {
        activeSong.avatar && ( 
        <img   src =  {`http://127.0.0.1:8000${activeSong.avatar }`}
        alt='song_img' 
        className=' w-48 h-48  flex justify-center mt-10 ' />

       )

    }
    {
        activeSong.avatar && ( 
            <p className="text-white font-bold mt-2 mb-2">{activeSong.name}</p>)

    }
    {!activeSong.avatar &&
    (
        <img   src =  {`http://127.0.0.1:8000${songData.avatar }`}
        alt='song_img' 
        className=' w-48 h-48  flex justify-center mt-10 ' />
        
    )
     }
     {!activeSong.avatar &&
    (
        <p className="text-white font-bold mt-2 mb-2">{songData.name}</p>
        
    )
     }
        
      
     
       <PlayPause
         isPlaying={isPlaying}
         activeSong={activeSong}
         song={activeSong}
         handlePause={handlePauseClick}
         handlePlayClick={handlePlayClick}
       />
        </div>
    )





const PlaylistDetails= () => {
  const dispatch = useDispatch();

  const  {playlistid} = useParams();
  
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  console.log("song dnag phat")
  console.log(activeSong)

  const { data: songData, isFetching: isFetchingSongDetails } =
    useGetPlaylistDetailsQuery({ playlistid });

  if (isFetchingSongDetails) return <Loader title="Searching song details" />;
  console.log("song data");
  console.log(songData.avatar);

 
  const related = songData.songs;
  
  console.log(related)
  const related_song = Array.isArray(related) ? related : [related];
  
  
  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, data ,index) => {
    dispatch(setActiveSong({ song, data, index}));
    dispatch(playPause(true));
  };
 

  return (
    <div className="flex flex-col">
    
<div className="flex flex-row">

<div className=" flex flex-col   mb-10 w-1/2 ">
    <div className="flex  justify-center flex-row">
    <p className="text-white  mb-4 flex ">{songData.name}</p>
    <Link to =  {`/playlist/${songData.id}/edit`}>
    <AiFillEdit className="text-white "/>
    </Link>
   
    </div>
  

<PlaySong 
songData = {songData}
related_song={related_song}

isPlaying={isPlaying}
activeSong={activeSong}
handlePauseClick={handlePauseClick}
handlePlayClick={() => handlePlayClick(activeSong, related_song, activeSong.index)}
 />
     
      </div>
      <div className='mt-4 w-1/2 flex flex-col gap-1 mr-10'>
          {related_song?.map((song, index) => (
            <TopChartCard
              key={index}
              song={song}
             
              index={index}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePauseClick={handlePauseClick}
              handlePlayClick={() => handlePlayClick(song, related_song,index)}
            />
          ))}
        </div>
</div>
    
 
    </div>
  );
};

export default PlaylistDetails;
