import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs ,TopChartCard, Like,
  Liked,AddPlaylist,} from "../components";
  import {AiFillEdit} from 'react-icons/ai';
  import { Link } from "react-router-dom";
import { setActiveSong, playPause } from "../redux/features/playerSlice";
import { getSongDetails,editAction } from "../redux/services/Api";

import { likeAction, getTopChart, getFavouriteSongs, playSong } from "../redux/services/Api";



const SongDetails = () => {
  const dispatch = useDispatch();

  const { songid } = useParams();
  const [likeState, setLikeState] = useState("likestates");
  const [dataFavo, setDataFav] = useState();
  const [likedSong, setLikeSdSong] = useState([]);
  const [likeSongId, setLikeSongId] = useState([]);
  const [state, setState] = useState('state');
  const [responseData, setresponseData] = useState();
  const [songData,setSongData] = useState();
  const [relatedSong, setRelativeSong] = useState([]);

  const { activeSong, isPlaying, username, password, isLogin } = useSelector((state) => state.player);

  useEffect(() => {
   
    // Thay đổi key khi component được mount lại hoặc focus
   
    setState("state-" + new Date().getTime());
    
  }, []);





  useEffect(() => {
    const fetchData = async () => {

debugger
      await getSongDetails(username, password,songid ).then(response => {
        setresponseData(response.data);
       
      })
        ;

    }


    fetchData();
  }, [state]);

  useEffect(() => {
   
    if (responseData !== undefined && Array.isArray(responseData.related_songs)) {
      setRelativeSong(responseData.related_songs);
      setSongData(responseData.songs);
    
    }


  }, [responseData]);
  useEffect(() => {
   
  if(likedSong !== null){
    setLikeSongId([]);
    likedSong.map((song,index) => setLikeSongId((prevState) => [...prevState, song.played_song.id]));
    
  }
     
    //  console.log(likeSongId)
    //  console.log(likeSongId.includes(parseInt(songid, 10)));
    // debugger


  }, [likedSong]);
  const handleLike = async (songId, songName) => {
    console.log("check like song ở dòng 77")
    console.log(songId);

    try {
      const responseLike = await likeAction(username, password, songId, "song");

      setLikeState("likestates-" + new Date().getTime());



    } catch (error) {
      console.log(error);
    }




  };
  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick =  async (song, data ,index) => {
    try {
      const response = await playSong(username, password, song.id);
    } catch (error) {
      console.log(error);
    }
    dispatch(setActiveSong({ song, data, index}));
    dispatch(playPause(true));
  };
 

  return (
    <div className="flex flex-col">
      
      <DetailsHeader
        artistId={songData?.id}
        songData={songData}
        handlePauseClick={handlePauseClick}
        handlePlayClick={() => handlePlayClick(songData, relatedSong,relatedSong.length + 1)}
      />
       <Link to =  {`/song/${songid}/edit`}>
    <AiFillEdit className="text-white "/>
    </Link>
       

  

      
<div className="flex flex-row">
 

<div className="mb-10 w-1/2 ">
  <div className="flex flex-row">
  <div className='flex flex-row items-center   rounded-2xl cursor-pointer  '>

{isLogin === true  &&
  likeSongId.includes(parseInt(songid, 10)) && <Liked className=' flex mb-2 text-center ' handleLike={() => handleLike(songid, song.name)} />
}
{isLogin === true  &&
  !likeSongId.includes(parseInt(songid, 10)) && <Like className=' flex text-center' handleLike={() => handleLike(songid, song.name)} />
}
</ div>

<AddPlaylist songid={songid} />
  </div>

  
        <h2 className="text-gray-100 text-3xl font-bold">Lyrics:</h2>

        <div className="mt-5">
          {songData ? (
            <p className="text-gray-300 text-base my-1">{songData?.lyric_data}</p>
          ) : (
            <p className="text-gray-300 text-base my-1">
              Sorry, No lyrics found!
            </p>
          )}
        </div>
      </div>
      <div className='mt-4 w-1/2 flex flex-col gap-1 mr-10'>
          {relatedSong?.map((song, index) => (
            <TopChartCard
              key={index}
              song={song}
             
              index={index}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePauseClick={handlePauseClick}
              handlePlayClick={() => handlePlayClick(song, relatedSong,index)}
            />
          ))}
        </div>
</div>
    
 
    </div>
  );
};

export default SongDetails;
