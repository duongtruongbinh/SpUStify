import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'react';
import { useState, useEffect } from 'react';
import React from 'react';
import { Error, Loader, SongCard, LeaderboardCard, Like,Liked,AddPlaylist  } from '../components';
import { useGetTopChartsQuery, useLikeSongMutation, usePlaySongMutation } from '../redux/services/CoreApi';


import { playPause, setActiveSong, setLikeSongId, setRemoveSong } from '../redux/features/playerSlice';
import {bgPlaylist, LiuGrace }from '../assets';


const TopCharts = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying, likedSongsId} = useSelector((state) => state.player);
  console.log("huhu")
  console.log(likedSongsId)

  const [setLikeSongName, { isLoading}] = useLikeSongMutation();
  const { data, isFetching, error } =  useGetTopChartsQuery();
  const [setPlaySong, {isLoading: isLoadingSong, response}] = usePlaySongMutation();

  

  const handleLike = async (songId,songName) => {
    console.log(songId)
    
    try {
      const [{request}]=  dispatch(setLikeSongName(songId));
     
    }catch(error){
      console.log(error);
    }
   
    if(isLoading){
      return <Loader  title='Loading DATA...' />
    }
    likedSongsId.includes(songName) ? dispatch(setRemoveSong(songName)) : dispatch(setLikeSongId(songName));
      
      
  
   
  
  };
  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, data, index) => {
    try {
      const [{request}]=  dispatch(setPlaySong(song.id));
    } catch(error){
      console.log(error);
    }
    if(isLoading){
      return <Loader  title='Loading DATA...' />
    }
    dispatch(setActiveSong({ song, data, index }));
    dispatch(playPause(true));
  };

  if (isFetching || isLoading || isLoadingSong) return <Loader title='Loading DATA...' />;

  if (error ) return <Error />;

 
  const likes = data['likes_leaderboard'];
  console.log("leader like ne")
  console.log(likes)
  const listens = data["listens_leaderboard"];
  const dataLikes = Array.isArray(likes) ? likes : [likes];
  const dataListens = Array.isArray(listens) ? listens : [listens];
 
 
  
  return (
    <div  className=' flex flex-col'>
      <div className='w-full flex flex-col'>
      <div className='w-full relative'>
        <div
          className='h-64 bg-cover bg-center'
          style={{ backgroundImage: `url(${bgPlaylist})` }}>
          
        </div>
        <div className='absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent'></div>
      </div>
      <div className='bg-gray-900 text-white p-8 rounded-lg shadow-lg'>
          <h3 className='text-3xl font-bold leading-tight animate-pulse '>
            LEADER BOARD
          </h3>
        </div>
        <div className='mt-4 flex flex-col gap-1'>
          {likes?.map((song, index) => (
             <div className='flex flex-row items-center text-center' key={song.id}>
              
             <LeaderboardCard
               song={song}
               index={index}
               isPlaying={isPlaying}
               activeSong={activeSong}
               handlePauseClick={handlePauseClick}
               handlePlayClick={() => handlePlayClick(song, likes, index)}
             />
           <div className='flex flex-row items-center hover:bg-gray-400/50 py-2 p-4 rounded-2xl cursor-pointer mb-2'> 

   {
  likedSongsId.includes(song.name) && <Liked className='mb-2 text-center'  handleLike={ () => handleLike(song.id,song.name)}  />
}
{
!likedSongsId.includes(song.name) &&  <Like className='text-center'  handleLike={ () => handleLike(song.id,song.name)} />
}
           </ div> 
             

            
             <AddPlaylist />
           </div>
            
))}
           
        </div>
      </div>

      <div className='w-full flex flex-col mt-8 mb-10'>
      

      

      </div>
    </div>
  )
};

export default TopCharts;
