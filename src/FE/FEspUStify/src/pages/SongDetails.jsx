import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';

import { setActiveSong, playPause } from '../redux/features/playerSlice';
import { useGetSongDetailsQuery, useGetSongRecommendQuery  } from '../redux/services/CoreApi';

const SongDetails = () => {
  const dispatch = useDispatch();


  const { songid} = useParams();
  
  
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const { data: songData, isFetching: isFetchingSongDetails } = useGetSongDetailsQuery({ songid });

  if (isFetchingSongDetails) return <Loader title="Searching song details" />;
console.log("song data")
  console.log(songData);

  const related = songData['related_songs'];
  const song = songData['song'];
  console.log(song)
  const related_song = Array.isArray(related) ? related : [related];
  console.log(related_song)

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  return (
    <div className="flex flex-col">
      <DetailsHeader
        artistId={related_song[0].main_artist.id}
        songData={song}
      />

      <div className="mb-10">
        <h2 className="text-gray-100 text-3xl font-bold">Lyrics:</h2>

        <div className="mt-5">
          {song?
          
              <p  className="text-gray-300 text-base my-1">{song.lyric_data}</p>
            
            : (
              <p className="text-gray-300 text-base my-1">Sorry, No lyrics found!</p>
            )}
              
        </div>
      </div>

      <RelatedSongs
        data={related_song}
        artistId={related_song[0].main_artist.id}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseClick={handlePauseClick}
        handlePlayClick={handlePlayClick}
      />

    </div>
  );
};

export default SongDetails;