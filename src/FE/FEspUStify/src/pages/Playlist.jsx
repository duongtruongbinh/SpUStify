import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {AiOutlinePlus} from 'react-icons/ai';
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
  useAddSongToPlaylistMutation
} from "../redux/services/CoreApi";
import { useGetPlaylistsQuery } from "../redux/services/CoreApi";
import { setActiveSong } from "../redux/features/playerSlice";

import { playPause } from "../redux/features/playerSlice";

const Playlist = () => {
  const [startIndexSong, setStartIndexSong] = useState(0);
  const [endIndexSong, setEndIndexSong] = useState(4);
  const [startIndexPlaylist, setStartIndexPlaylist] = useState(0);
  const [endIndexPlaylist, setEndIndexPlaylist] = useState(4);

  const dispatch = useDispatch();
  const { activeSong, isPlaying, currentSongs } = useSelector((state) => state.player);
  const [favouriteKey, setFavouriteKey] = useState('favourite-songs');
  const [topChartsKey, setTopChartsKey] = useState('top-charts');
 const { data: currentData, isLoading: isFavouriteLoading, isError: isFavouriteError } = useGetFavouriteSongsQuery({ key: favouriteKey });
  const { data: topChartsData, isFetching: isTopChartsFetching, error: topChartsError } = useGetPlaylistsQuery({ key: topChartsKey }); // Add this line

  
  useEffect(() => {
    // Thay đổi key khi component được mount lại hoặc focus
    setFavouriteKey('favourite-songs-' + new Date().getTime());
    setTopChartsKey('top-charts-' + new Date().getTime());
  }, []);
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



  if (isFavouriteLoading || isTopChartsFetching || isLoadingSong ) {
    return <Loader title="Loading data..." />;
  }

  if (isFavouriteError || topChartsError) {
    return <Error message="Error fetching data." />;
  }

  const ListPlaylist = topChartsData;
console.log("playlist")
  console.log(ListPlaylist)

  
  const dataPlaylist = Array.isArray(ListPlaylist)
    ? ListPlaylist
    : [ListPlaylist];
  // const genreTitle = genres.find(({ value }) => value === genreListId)?.title

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-2 mb-10">
        <h2 className="text-xl mt-2 text-gray-100 text-left">
          Welcome to SpUStify
          {/* {genreTitle} */}
        </h2>
      
      </div>

      <div>
  <div className="border border-dashed border-gray-300 p-4 h-[180px] w-[160px] flex flex-col items-center justify-center mb-5">
                     <Link to={'/create-playlist'} >
<AiOutlinePlus className="text-white" size={100} />
                    <p className="text-white">Create Playlist</p> 
                     </Link>
                            
                        </div>
      </div>
      <div className="flex flex-col items-center gap-9">
       
   

 
        <div className=" relative flex flex-wrap sm:justify-start justify-center gap-8">
        

          {dataPlaylist?.map((song, index) => (
            <PlaylistCard
              key={song.id}
              song={song}
              isPlaying={isPlaying}
              activeSong={activeSong}
             
              index={index}
            />
          ))}



</div  >







</div>

      
    </div>
  );
};

export default Playlist;
