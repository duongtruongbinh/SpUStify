import React from 'react';
import { Link } from 'react-router-dom';
import Na from '../assets/Liu-Grace.jpeg';

import PlayPause from './PlayPause';

const SongBar = ({ song, index, artistId, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => (
  <div className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${activeSong?.title === song?.title ? 'bg-white/5 backdrop-blur-sm' : 'bg-transparent'} py-2 p-4 rounded-2xl cursor-pointer mb-2`}>
    <h3 className="font-bold text-base text-gray-100 mr-3">{index + 1}.</h3>
    <div className="flex-1 flex flex-row justify-between items-center">
      <img
        className="w-20 h-20 rounded-2xl object-cover"
        //src={artistId ? song?.attributes?.artwork?.url.replace('{w}', '125').replace('{h}', '125') : song?.avatar?.coverart}
        src = {`http://127.0.0.1:8000${song.avatar }`}
        alt={song?.name}
      />
      <div className="flex-1 flex flex-col justify-center mx-3">
        {!artistId ? (
          <Link to={`/songs/${song.id}`}>
            <p className="text-xl font-bold text-gray-100">
              {song?.name}
            </p>
          </Link>
        ) : (
          <p className="text-xl font-bold text-gray-100">
            {song?.name}
          </p>
        )}
        <p className="text-base text-gray-300 mt-1">
          abulm nhưng không có
        </p>
      </div>
    </div>
    {!artistId
      ? (
        <PlayPause
          isPlaying={isPlaying}
          activeSong={activeSong}
          song={song}
          handlePause={handlePauseClick}
          handlePlay={() => handlePlayClick(song, index)}
        />
      )
      : null}
  </div>
);

export default SongBar;