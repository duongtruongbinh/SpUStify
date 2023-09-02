import { useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';

import React from 'react';
import { Dispatch } from 'react';
import {bgPlaylist, LiuGrace }from '../assets';


import { useGetFavouriteSongsQuery, useLikeSongMutation, usePlaySongMutation, useAddSongToPlaylistMutation } from '../redux/services/CoreApi';
import { Error, Loader, LeaderboardCard, AddPlaylist,UserHeader} from '../components';

import { playPause, setActiveSong, setLikeSongId, setRemoveSong } from '../redux/features/playerSlice';


const FavorutieSong = () => {


  const dispatch = useDispatch();
  const { activeSong, isPlaying , username} = useSelector((state) => state.player);

 
  const [setLikeSongName, { isLoading }] = useLikeSongMutation();
  const { data, isFetching, error } = useGetFavouriteSongsQuery();
  const [setPlaySong, { isLoading: isLoadingSong, response }] = usePlaySongMutation();


  const handleaddSong = ({songid,namePlaylist}) => {
    try {
        const response = dispatch(setAddSong({songid,namePlaylist}));
    } catch(error){
        console.log(error)
    }

}







 
  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, data, index) => {
    try {
      const [{ request }] = setPlaySong(song.id);
    } catch (error) {
      console.log(error);
    }
    if (isLoading) {
      return <Loader title='Loading DATA...' />
    }
    dispatch(setActiveSong({ song, data, index }));
    dispatch(playPause(true));
  };

  if (isFetching || isLoading || isLoadingSong) return <Loader title='Loading DATA...' />;

  if (error) return <Error />;


  const datas = data;
 // console.log(datas[0]['played_song']);

  const LikedSong = Array.isArray(datas) ? datas: [datas];
  console.log("check top chart")
console.log(LikedSong)

const userData = {
  "username": username,
  "avatar": LiuGrace,
  "background": LiuGrace
}
console.log(userData)
  return (
    <div className=' flex flex-col'>
        <UserHeader
       songData={userData}
      />
      <div className='w-full flex flex-col'>
     
      
        <div className='mt-4 flex flex-col gap-1'>
          {LikedSong?.map((song, index) => (
            <div className='flex flex-row items-center text-center' key={song.id}>

              <LeaderboardCard
                song={song}
                index={index}
                isPlaying={isPlaying}
                activeSong={activeSong}
                handlePauseClick={handlePauseClick}
                handlePlayClick={() => handlePlayClick(song, LikedSong, index)}
              />
           



              <AddPlaylist
              
              songid = {song.id}
               />
            </div>

          ))}

        </div>
      </div>

    </div>
  )
};

export default FavorutieSong;