import { useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';

import React from 'react';
import { Dispatch } from 'react';
import {bgPlaylist, LiuGrace }from '../assets';


import { useGetFavouriteSongsQuery, useLikeSongMutation, usePlaySongMutation } from '../redux/services/CoreApi';
import { Error, Loader, SongCard, LeaderboardCard, Like, Liked, AddPlaylist,DetailsHeader } from '../components';

import { playPause, setActiveSong, setLikeSongId, setRemoveSong } from '../redux/features/playerSlice';


const FavorutieSong = () => {


  const dispatch = useDispatch();
  const { activeSong, isPlaying, likedSongsId } = useSelector((state) => state.player);


  const [setLikeSongName, { isLoading }] = useLikeSongMutation();
  const { data, isFetching, error } = useGetFavouriteSongsQuery();
  const [setPlaySong, { isLoading: isLoadingSong, response }] = usePlaySongMutation();



  const handleLike = async (songId, songName) => {
    console.log(songId)

    try {
      const [{ request }] = setLikeSongName(songId);

    } catch (error) {
      console.log(error);
    }

    if (isLoading) {
      return <Loader title='Loading DATA...' />
    }
    likedSongsId.includes(songName) ? dispatch(setRemoveSong(songName)) : dispatch(setLikeSongId(songName));





  };
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


  const datas = data['favourite_songs'];
  console.log(datas[0]['played_song']);

  const LikedSong = Array.isArray(datas[0]['played_song']) ? datas[0]['played_song']: [datas[0]['played_song']];




  return (
    <div className=' flex flex-col'>
        <DetailsHeader
        artistId={0}
       songData={LikedSong}
      //  handlePauseClick={handlePauseClick}
      //  handlePlayClick={() => handlePlayClick(song, related_song,related_song.length + 1)}
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
              <div className='flex flex-row items-center hover:bg-gray-400/50 py-2 p-4 rounded-2xl cursor-pointer mb-2'>

                {
                  likedSongsId.includes(song.name) && <Liked className='mb-2 text-center' handleLike={() => handleLike(song.id, song.name)} />
                }
                {
                  !likedSongsId.includes(song.name) && <Like className='text-center' handleLike={() => handleLike(song.id, song.name)} />
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

export default FavorutieSong;