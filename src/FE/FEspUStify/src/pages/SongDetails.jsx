import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs ,TopChartCard, Like,
  Liked,AddPlaylist,} from "../components";

import { setActiveSong, playPause } from "../redux/features/playerSlice";
import {
  useGetSongDetailsQuery,
  useGetSongRecommendQuery,
} from "../redux/services/CoreApi";
import { likeAction, getTopChart, getFavouriteSongs, playSong } from "../redux/services/Api";



const SongDetails = () => {
  const dispatch = useDispatch();

  const { songid } = useParams();
  const [likeState, setLikeState] = useState("likestates");
  const [dataFavo, setDataFav] = useState();
  const [likedSong, setLikeSdSong] = useState([]);
  const [likeSongId, setLikeSongId] = useState([]);
  const { activeSong, isPlaying, username, password, isLogin } = useSelector((state) => state.player);

  const { data: songData, isFetching: isFetchingSongDetails } =
    useGetSongDetailsQuery({ songid });

  if (isFetchingSongDetails) return <Loader title="Searching song details" />;
  console.log("song data");
  console.log(songData);

  const related = songData["related_songs"];
  const song = songData["song"];
  console.log(song);
  const related_song = Array.isArray(related) ? related : [related];
  useEffect(() => {
    const fetchData = async () => {


      await getFavouriteSongs(username, password).then(response => {
        setDataFav(response.data);
       
      })
        ;

    }


    fetchData();
  }, [likeState]);

  useEffect(() => {
   
    if (dataFavo !== undefined && Array.isArray(dataFavo.favourite_songs)) {
      setLikeSdSong(dataFavo.favourite_songs);
    
    }


  }, [dataFavo]);
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
        artistId={related_song[0]?.main_artist.id}
        songData={song}
        handlePauseClick={handlePauseClick}
        handlePlayClick={() => handlePlayClick(song, related_song,related_song.length + 1)}
      />
       

  

      
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
          {song ? (
            <p className="text-gray-300 text-base my-1">{song.lyric_data}</p>
          ) : (
            <p className="text-gray-300 text-base my-1">
              Sorry, No lyrics found!
            </p>
          )}
        </div>
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

export default SongDetails;
