import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs ,TopChartCard} from "../components";
import PlayPause from "../components/PlayPause";
import {AiFillEdit} from 'react-icons/ai';
import { Link } from "react-router-dom";
import { setActiveSong, playPause } from "../redux/features/playerSlice";
import { getPlaylistDetails } from "../redux/services/Api";
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
  const [playlistDetail, setPlaylistDetail] = useState([]);
  const [playlist, setPlaylist] = useState();
  const [state, setState] = useState('state')


  const  {playlistid} = useParams();
 console.log(playlistid)
  
  const { activeSong, isPlaying, username, password } = useSelector((state) => state.player);
  // getPlaylistDetails(username, password, 31).then(response => {
  //   setPlaylist(response.data);
  //   console.log(playlist);


  // });
  useEffect(() => {
    debugger
    // Thay đổi key khi component được mount lại hoặc focus
   
    setState("state-" + new Date().getTime());
    
  }, []);
  useEffect(() => {
    debugger
    console.log("check cho CD coi")
      console.log(playlistid);
    const fetchData = async () => {
      

      await getPlaylistDetails(username, password, playlistid).then(response => {
        setPlaylist(response.data);
        
        console.log(playlist);
   

      });

    }
    fetchData();
  }, [state]);
  useEffect(() => {
   
    if (playlist !== undefined && Array.isArray(playlist.songs)) {
      setPlaylistDetail(playlist.songs);
    debugger
    }


  }, [playlist]);


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
    <p className="text-white  mb-4 flex "> {playlist? playlist.name: ''}</p>
    <Link to =  {`/playlist/${playlist? playlist.id: ''}/edit`}>
    <AiFillEdit className="text-white "/>
    </Link>
   
    </div>
  

<PlaySong 
songData = {activeSong}
related_song={playlistDetail}

isPlaying={isPlaying}
activeSong={activeSong}
handlePauseClick={handlePauseClick}
handlePlayClick={() => handlePlayClick(activeSong, playlistDetail, activeSong.index)}
 />
     
      </div>
      <div className='mt-4 w-1/2 flex flex-col gap-1 mr-10'>
          {playlistDetail?.map((song, index) => (
            <TopChartCard
              key={index}
              song={song}
             
              index={index}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePauseClick={handlePauseClick}
              handlePlayClick={() => handlePlayClick(song, playlistDetail,index)}
            />
          ))}
        </div>
</div>
    
 
    </div>
  );
};

export default PlaylistDetails;
