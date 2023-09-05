import { useSelector, useDispatch } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import { Link } from "react-router-dom";

import { Error, Loader, SongCard, PlaylistCard } from '../components';
import { useGetSongsBySearchQuery, useGetAllBySearchQuery, usePlaySongMutation } from '../redux/services/CoreApi';
import { getItemBySearch } from '../redux/services/Api';
import { setActiveSong, playPause } from '../redux/features/playerSlice';

import React, { useState, useEffect } from 'react';

const Search = () => {

  const location = useLocation();
  const currentRoute = location.pathname;
  const dispatch = useDispatch();


  const { searchTerm } = useParams();
  const { activeSong, isPlaying, username, password } = useSelector((state) => state.player);
  const [data, setData] = useState();
  const [songSearch, setSongSearch] = useState([]);
  const [playlistSearch, setPlaylistSearch] = useState([]);
  const [ArtistSearch, setArtistSearch] = useState([]);

  // const { dataAll, isLoading, error: isError} = useGetAllBySearchQuery(searchTerm);

  const [setPlaySong, { isLoading: isLoadingSong, response }] = usePlaySongMutation();

  useEffect(() => {
    const fetchData = async () => {

      await getItemBySearch(searchTerm).then(response => {
        setData(response.data);
      });

    }

    fetchData();
  }, [searchTerm]);
  useEffect(() => {
    if (data !== undefined) {
      setSongSearch(data.songs);
      setPlaylistSearch(data.playlists);
      setArtistSearch(data.artists);
      // setDataFav( dataFavo.favourite_songs ) ;

    }


  }, [data]);


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
    <div className='flex flex-col'>
      <h2 className='text-xl text-gray-100 text-left mt-4 mb-10'>
        Showing results for <span className='font-white'>{searchTerm}</span>
      </h2>
      {
        !(songSearch && ArtistSearch && playlistSearch) && (
          <h2>NO RESULT</h2>
        )
      }

      <h2 className='text-white my-10 font-bold'>Songs</h2>
      <div className='flex flex-wrap sm:justify-start justify-center gap-8'>
        {songSearch?.map((song, index) => (
          <SongCard
            key={index}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            index={index}
            handlePauseClick={handlePauseClick}
            handlePlayClick={() => handlePlayClick(song, songSearch, index)}
          />
        ))}
      </div>
      <h2 className='text-white my-10 font-bold'>Playlist</h2>
      <div className='flex flex-wrap sm:justify-start justify-center gap-8'>
        {playlistSearch?.map((song, index) => (
          <PlaylistCard
            key={song.id}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            index={index}
          />
        ))}
      </div>
      <h2 className='text-white my-10 font-bold'>Artist</h2>
      <div className='flex flex-wrap sm:justify-start justify-center gap-8'>
        <Swiper
          slidesPerView="auto"
          spaceBetween={15}
          freeMode
          centeredSlides
          centeredSlidesBounds
          modules={[FreeMode]}
          className="mt-4">
          {ArtistSearch?.map((song, index) => (
            <SwiperSlide
              key={index}
              style={{ width: "100%", height: "auto" }}
              className="shadow-lg rounded-full animate-slideright">
              <Link to={`/artists/${song?.id}`}>
                <img
                  src={`http://127.0.0.1:8000${song?.avatar}`}
                  //{song?.avatar}
                  alt="name"
                  className="rounded-full object-cover w-auto"
                  style={{ width: "100px", height: "100px" }}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </div>
  );
};

export default Search;
