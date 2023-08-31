import { useSelector, useDispatch } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';

import { Error, Loader, SongCard } from '../components';
import { useGetSongsBySearchQuery, useGetAllBySearchQuery, usePlaySongMutation } from '../redux/services/CoreApi';

import { setActiveSong, playPause } from '../redux/features/playerSlice';

import React, { useState, useEffect } from 'react';

const Search = () => {

  const location = useLocation();
  const currentRoute = location.pathname;
  const dispatch = useDispatch();


  const { searchTerm } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
 
  // const { dataAll, isLoading, error: isError} = useGetAllBySearchQuery(searchTerm);


  const { data, isFetching, error } = useGetSongsBySearchQuery(searchTerm);
  const [setPlaySong, { isLoading: isLoadingSong, response }] = usePlaySongMutation();


  console.log("search result")
  console.log(data)
  const songs = Array.isArray(data) ? data : [data];

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };
  const handlePlayClick = (song, data, index) => {
    try {
      console.log("songcard")
      console.log(song.id)
      const [{ request }] = dispatch(setPlaySong(song.id));
    } catch (error) {
      console.log(error);
    }
    if (isLoadingSong) {
      return <Loader title='Loading DATA...' />
    }
    dispatch(setActiveSong({ song, data, index }));
    dispatch(playPause(true));
  };

  if (isFetching) return <Loader title='Loading top charts' />;

  if (error) return <Error />;

  return (
    <div className='flex flex-col'>
      <h2 className='text-xl text-gray-100 text-left mt-4 mb-10'>
        Showing results for <span className='font-white'>{searchTerm}</span>
      </h2>

      <div className='flex flex-wrap sm:justify-start justify-center gap-8'>
        {songs?.map((song, index) => (
          <SongCard
            key={index}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            index={index}
            handlePauseClick={handlePauseClick}
            handlePlayClick={() => handlePlayClick(song, songs, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
