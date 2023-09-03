import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";

import React from "react";
import { Dispatch } from "react";
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
  setLikeSongId,
  setRemoveSong,
} from "../redux/features/playerSlice";

import { likeAction } from "../redux/services/Api";

const FavorutieSong = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying, username, password, likedSongsId } =
    useSelector((state) => state.player);

  const [likeState, setLikeState] = useState("likestates");
  //const [setLikeSongName, { isLoading }] = useLikeSongMutation();
  const { data, isFetching, error } = useGetFavouriteSongsQuery({
    key: likeState,
  });
  const [setPlaySong, { isLoading: isLoadingSong, response }] =
    usePlaySongMutation();

  const handleaddSong = ({ songid, namePlaylist }) => {
    try {
      const response = dispatch(setAddSong({ songid, namePlaylist }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (songId, songName) => {
    console.log(songId);

    try {
      const [{ request }] = dispatch(
        likeAction(username, password, songId, "song")
      );
      setLikeState("likestates-" + new Date().getTime());
    } catch (error) {
      console.log(error);
    }

    if (isFetching) {
      return <Loader title="Loading DATA..." />;
    }
    likedSongsId.includes(songName)
      ? dispatch(setRemoveSong(songName))
      : dispatch(setLikeSongId(songName));
  };

  // useEffect(() => {
  //   // Thay đổi key khi component được mount lại hoặc focus

  //   setLikeState("likestates-" + new Date().getTime());
  // }, [!isLoading]);

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
      return <Loader title="Loading DATA..." />;
    }
    dispatch(setActiveSong({ song, data, index }));
    dispatch(playPause(true));
  };

  if (isFetching || isLoadingSong) return <Loader title="Loading DATA..." />;

  if (error) return <Error />;

  const datas = data;
  console.log("check favourite nha");
  console.log(datas.favourite_songs[0].played_song);

  const LikedSong = Array.isArray(datas.favourite_songs)
    ? datas.favourite_songs
    : [datas.favourite_songs];
  console.log("check top chart");
  console.log(LikedSong);

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
          {LikedSong?.map((song, index) => (
            <div
              className="flex flex-row items-center text-center"
              key={song.id}>
              <LeaderboardCard
                song={song.played_song}
                index={index}
                isPlaying={isPlaying}
                activeSong={activeSong}
                handlePauseClick={handlePauseClick}
                handlePlayClick={() =>
                  handlePlayClick(song.played_song, LikedSong, index)
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
