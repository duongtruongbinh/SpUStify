import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import React from "react";
import {
  Error,
  Loader,
  SongCard,
  LeaderboardCard,
  Like,
  Liked,
  AddPlaylist,
} from "../components";
import {
  useGetTopChartsQuery,
  usePlaySongMutation,
} from "../redux/services/CoreApi";

import {
  playPause,
  setActiveSong,
  setLikeSongId,
  setRemoveSong,
} from "../redux/features/playerSlice";
import { bgPlaylist, LiuGrace } from "../assets";
import { likeAction, getTopChart, getFavouriteSongs, playSong } from "../redux/services/Api";
const TopCharts = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying, isLogin, username, password } =
    useSelector((state) => state.player);

  const [likeState, setLikeState] = useState("likestates");
  const [topChartState, setTopChart] = useState("getTopChart");
  const [dataTopChart, setDataTopChart] = useState([]);
  const [getData, setGetData] = useState();
  const [dataFavo, setDataFav] = useState();
  const [likedSong, setLikeSdSong] = useState([]);
  const [likeSongId, setLikeSongId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {


      await getTopChart().then(response => {
        setGetData(response.data);
        
      })
        ;

    }


    fetchData();
  }, []);

  useEffect(() => {
    if (getData !== undefined && Array.isArray(getData["likes_leaderboard"])) {
      setDataTopChart(getData["likes_leaderboard"]);


    }


  }, [getData]);


  useEffect(() => {
    const fetchData = async () => {


      await getFavouriteSongs(username, password).then(response => {
        setDataFav(response.data);
        console.log(dataFavo);
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
     
     console.log(likeSongId)
    


  }, [likedSong]);




    const handleLike = async (songId, songName) => {
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

  const handlePlayClick = async (song, data, index) => {
    try {
      const response = await playSong(username, password, song.id);
    } catch (error) {
      console.log(error);
    }

    dispatch(setActiveSong({ song, data, index }));
    dispatch(playPause(true));
  };




  return (
    <div className=" flex flex-col">
      <div className="w-full flex flex-col">
        <div className="w-full relative">
          <div
            className="h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgPlaylist})` }}></div>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold leading-tight animate-pulse ">
            LEADER BOARD
          </h3>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          {dataTopChart?.map((song, index) => (
            <div
              className="flex flex-row items-center text-center"
              key={song.id}>
              <LeaderboardCard
                song={song}
                index={index}
                isPlaying={isPlaying}
                activeSong={activeSong}
                handlePauseClick={handlePauseClick}
                handlePlayClick={() => handlePlayClick(song, dataTopChart, index)}
              />
              <div className='flex flex-row items-center hover:bg-gray-400/50 py-2 p-4 rounded-2xl cursor-pointer mb-2'>

                {isLogin === true  &&
                  likeSongId.includes(song.id) && <Liked className='mb-2 text-center' handleLike={() => handleLike(song.id, song.name)} />
                }
                {isLogin === true  &&
                  !likeSongId.includes(song.id) && <Like className='text-center' handleLike={() => handleLike(song.id, song.name)} />
                }
              </ div>

              <AddPlaylist songid={song.id} />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col mt-8 mb-10"></div>
    </div>
  );
};
debugger;
export default TopCharts;
