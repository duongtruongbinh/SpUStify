import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs } from "../components";

import { setActiveSong, playPause } from "../redux/features/playerSlice";
import {
  useGetSongDetailsQuery,
  useGetSongRecommendQuery,
} from "../redux/services/CoreApi";



const SongDetails = () => {
  const dispatch = useDispatch();

  const { songid } = useParams();

  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const { data: songData, isFetching: isFetchingSongDetails } =
    useGetSongDetailsQuery({ songid });

  if (isFetchingSongDetails) return <Loader title="Searching song details" />;
  console.log("song data");
  console.log(songData);

  const related = songData["related_songs"];
  const song = songData["song"];
  console.log(song);
  const related_song = Array.isArray(related) ? related : [related];
  
  
  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, data ,index) => {
    dispatch(setActiveSong({ song, data, index}));
    dispatch(playPause(true));
  };
  console.log("curernt songs")
  console.log(currentSongs)

  return (
    <div className="flex flex-col">
      <DetailsHeader
        artistId={related_song[0].main_artist.id}
        songData={song}
        handlePauseClick={handlePauseClick}
        handlePlayClick={() => handlePlayClick(song, related_song,related_song.length + 1)}
      />

      <div className="mb-10">
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
      <div className='mt-4 flex flex-col gap-1 mr-10'>
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
