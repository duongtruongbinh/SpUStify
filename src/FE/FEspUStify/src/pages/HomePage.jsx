import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import {
  ButtonNext,
  ButtonPrev,
  Error,
  Loader,
  SongCard,
  BannerCard,
  PlaylistCard,
} from "../components";
import { genres } from "../assets/constants";
import {
  selectGenreListId,
  setLikeSongId,
} from "../redux/features/playerSlice";
import {
  useGetHomeQuery,
  useGetFavouriteSongsQuery,
  usePlaySongMutation,
} from "../redux/services/CoreApi";
import { useGetTopChartsQuery } from "../redux/services/CoreApi";
import { setActiveSong } from "../redux/features/playerSlice";

import { playPause } from "../redux/features/playerSlice";

const HomePage = () => {
  const [startIndexSong, setStartIndexSong] = useState(0);
  const [endIndexSong, setEndIndexSong] = useState(4);
  const [startIndexPlaylist, setStartIndexPlaylist] = useState(0);
  const [endIndexPlaylist, setEndIndexPlaylist] = useState(4);

  const dispatch = useDispatch();
  const { activeSong, isPlaying, currentSongs } = useSelector((state) => state.player);

 const { data: currentData, isLoading: isFavouriteLoading, isError: isFavouriteError } = useGetFavouriteSongsQuery();
  const { data: topChartsData, isFetching: isTopChartsFetching, error: topChartsError } =  useGetHomeQuery(); // Add this line

  const [setPlaySong, { isLoading: isLoadingSong, response }] =
    usePlaySongMutation();

  useEffect(() => {
    if (!isFavouriteLoading && !isFavouriteError && currentData) {
      console.log(currentData);
      const songLiked = currentData["favourite_songs"];
      console.log(songLiked);
      const dataLikeSong = Array.isArray(songLiked) ? songLiked : [songLiked];
      dataLikeSong.forEach((song) => {
        dispatch(setLikeSongId(song.song_name));
      });
    }
  }, [currentData, isFavouriteLoading, isFavouriteError, dispatch]);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, data, index) => {
    try {
      console.log("songcard");
      console.log(song.id);
      const [{ request }] = dispatch(setPlaySong(song.id));
    } catch (error) {
      console.log(error);
    }
    if (isLoadingSong) {
      return <Loader title="Loading DATA..." />;
    }
    dispatch(setActiveSong({ song, data, index }));
    dispatch(playPause(true));
  };

  if (isFavouriteLoading || isTopChartsFetching || isLoadingSong) {
    return <Loader title="Loading data..." />;
  }

  if (isFavouriteError || topChartsError) {
    return <Error message="Error fetching data." />;
  }

  const ListPlaylist = topChartsData["playlists"];

  const ListSong = topChartsData["songs"];

  const dataSong = Array.isArray(ListSong) ? ListSong : [ListSong];
  const dataPlaylist = Array.isArray(ListPlaylist)
    ? ListPlaylist
    : [ListPlaylist];
  // const genreTitle = genres.find(({ value }) => value === genreListId)?.title;

  const handleNextPageSong = () => {
    setStartIndexSong(startIndexSong + 1);
    setEndIndexSong(endIndexSong + 1);

    console.log(startIndexSong);
  };

  const handlePreviousPageSong = () => {
    setStartIndexSong(startIndexSong - 1);
    setEndIndexSong(endIndexSong - 1);
  };
  const handleNextPagePlaylist = () => {
    setStartIndexPlaylist(startIndexPlaylist + 1);
    setEndIndexPlaylist(endIndexPlaylist + 1);
  };

  const handlePreviousPagePlaylist = () => {
    setStartIndexPlaylist(startIndexPlaylist - 1);
    setEndIndexPlaylist(endIndexPlaylist - 1);
  };

  const visibleDataSong = dataSong.slice(startIndexSong, endIndexSong);

  const visibleDataPlaylist = dataPlaylist.slice(
    startIndexPlaylist,
    endIndexPlaylist
  );

  const hasPreviousPageSong = startIndexSong > 0;

  const hasNextPageSong = endIndexSong < dataSong.length;
  const hasPreviousPagePlaylist = startIndexPlaylist > 0;
  const hasNextPagePlaylist = endIndexPlaylist < dataPlaylist.length;

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-2 mb-10">
        <h2 className="text-xl mt-2 text-gray-100 text-left">
          Welcome to SpUStify
          {/* {genreTitle} */}
        </h2>
        {/* <select
          //  onChange={(e) => dispatch(selectGenreListId(e.target.value))}
          // value={genreListId || 'pop'}
          className='bg-white/10 backdrop-blur-sm text-gray-100 p-2 text-xs rounded-2xl outline-none sm:mt-0 mt-5'
        >
          {genres.map((genre) =>
            <option 
              key={genre.value} 
              value={genre.value}
            >
              {genre.title}
            </option>
          )}

        </select> */}
      </div>
      <div className="flex flex-col items-center gap-9">
        <h2 className="text-white ">Recommend Songs</h2>
        {/* <Link to=''>
</Link> */}

        <div className=" relative flex flex-wrap sm:justify-start justify-center gap-8">
          <div className="z-10 self-center left-[-20px] absolute">
            {hasPreviousPageSong && (
              <ButtonPrev onClick={handlePreviousPageSong} />
            )}
          </div>

          {visibleDataSong?.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={isPlaying}
              activeSong={activeSong}
              data={topChartsData}
              index={index}
              handlePauseClick={handlePauseClick}
              handlePlayClick={() =>
                handlePlayClick(song, dataSong, index)
              }
            />
          ))}

          <div className="absolute self-center right-[-30px]">
            {hasNextPageSong && <ButtonNext onClick={handleNextPageSong} />}
          </div>
        </div>

        <h2 className="text-white ml-0">Recommend Playlists</h2>
        <div className=" relative flex flex-wrap sm:justify-start justify-center gap-8">
          <div className="z-10 absolute self-center left-[-20px]">
            {hasPreviousPagePlaylist && (
              <ButtonPrev onClick={handlePreviousPagePlaylist} />
            )}
          </div>

          {visibleDataPlaylist?.map((song, index) => (
            <PlaylistCard
              key={song.id}
              song={song}
              isPlaying={isPlaying}
              activeSong={activeSong}
              data={topChartsData}
              index={index}
            />
          ))}


<div className='absolute self-center right-[-30px]' >
{
  hasNextPageSong && (
<ButtonNext onClick = {handleNextPageSong}/>
  )
}
</div>
</div  >







</div>

      
    </div>
  );
};

export default HomePage;
