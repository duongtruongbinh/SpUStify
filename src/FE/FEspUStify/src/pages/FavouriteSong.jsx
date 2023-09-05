import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";

import React from "react";

import { bgPlaylist, LiuGrace } from "../assets";

import {
  useGetFavouriteSongsQuery,
  usePlaySongMutation,

} from "../redux/services/CoreApi";
import {
  Error,
  Loader,
  LeaderboardCard,
  AddPlaylist,
  UserHeader,
  Liked,
} from "../components";

import {
  playPause,
  setActiveSong,

} from "../redux/features/playerSlice";

import { likeAction, getFavouriteSongs, playSong } from "../redux/services/Api";

const FavorutieSong = () => {


  const { activeSong, isPlaying, username, password } =
    useSelector((state) => state.player);

  const dispatch = useDispatch();
  const [dataFavo, setDataFav] = useState();
  const [likedSong, setLikeSdSong] = useState([]);
  const [likeState, setLikeState] = useState("likestates");
  //const [setLikeSongName, { isLoading }] = useLikeSongMutation();
  //const { data, isFetching, error } = useGetFavouriteSongsQuery({key: likeState});



  useEffect(() => {
    const fetchData = async () => {


      await getFavouriteSongs(username, password).then(response => {
        setDataFav(response.data);
        console.log(dataFavo);
      })
        ;

    }


    fetchData();
  }, [likeState]);
  useEffect(() => {
    if (dataFavo !== undefined && Array.isArray(dataFavo.favourite_songs)) {
      setLikeSdSong(dataFavo.favourite_songs);
      // setDataFav( dataFavo.favourite_songs ) ;
      console.log("check top chart");
      console.log(likedSong);
    }
  }
  )
  useEffect(() => {
    // Thay đổi key khi component được mount lại hoặc focus

  }, [dataFavo]);


  const handleLike = async (songId, songName) => {
    console.log(songId);

    try {
      const responseLike = await likeAction(username, password, songId, "song");

      setLikeState("likestates-" + new Date().getTime());


    } catch (error) {
      console.log(error);
    }
  };

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

  const userData = {
    username: username,
    avatar: LiuGrace,
    background: LiuGrace,
  };

  return (
    <div className=" flex flex-col">
      <UserHeader songData={userData} />
      <div className="w-full flex flex-col">
        <div className="mt-4 flex flex-col gap-1">
          {likedSong.map((song, index) => (
            <div
              className="flex flex-row items-center text-center"
              key={song.played_song.id}>
              <LeaderboardCard
                song={song.played_song}
                index={index}
                isPlaying={isPlaying}
                activeSong={activeSong}
                handlePauseClick={handlePauseClick}
                handlePlayClick={() =>
                  handlePlayClick(song.played_song, likedSong, index)
                }
              />

              <div className="flex flex-row items-center hover:bg-gray-400/50 py-2 p-4 rounded-2xl cursor-pointer mb-2">
                <Liked
                  className="mb-2 text-center"
                  handleLike={() =>
                    handleLike(song.played_song.id, song.played_song.name)
                  }
                />
              </div>

              <AddPlaylist songid={song.played_song.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavorutieSong;
