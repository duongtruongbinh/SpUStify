import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import React from "react";
import {
  Error,
  Loader,
  SongCard,
  LeaderboardCard,
  Like,
  Liked,
  AddPlaylist,
} from "../components";
import {
  useGetTopChartsQuery,
  usePlaySongMutation,
} from "../redux/services/CoreApi";

import {
  playPause,
  setActiveSong,
  setLikeSongId,
  setRemoveSong,
} from "../redux/features/playerSlice";
import { bgPlaylist, LiuGrace } from "../assets";
import { likeAction } from "../redux/services/Api";
const TopCharts = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying, likedSongsId, isLogin, username, password } =
    useSelector((state) => state.player);

  const [likeState, setLikeState] = useState("likestates");
  const [topChartState, setTopChart] = useState("getTopChart");

  useEffect(() => {
    // Thay đổi key khi component được mount lại hoặc focus
    setLikeState("likestates-" + new Date().getTime());
    setTopChart("top-charts-" + new Date().getTime());
  }, []);

  //const [setLikeSongName, { isLoading }] = useLikeSongMutation();
  const {
    data: dataTopChart,
    isFetching: isLoadingTopChart,
    error: errorTopChart,
  } = useGetTopChartsQuery();
  // const { data: dataFavourite, isFetching: isFetchingFavourite, error: isErrFavourite } = useGetFavouriteSongsQuery();
  const [setPlaySong, { isLoading: isLoadingSong, response }] =
    usePlaySongMutation();

  const handleLike = async (songId, songName) => {
    console.log(songId);

    try {
      const respond = likeAction(username, password, songId, "song");
    } catch (error) {
      console.log(error);
    }

    if (isLoading) {
      return <Loader title="Loading DATA..." />;
    }
    likedSongsId.includes(songName)
      ? dispatch(setRemoveSong(songName))
      : dispatch(setLikeSongId(songName));
  };
  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = async (song, data, index) => {
    try {
      const [{ request }] = await setPlaySong(song.id);
    } catch (error) {
      console.log(error);
    }
    if (isLoadingSong) {
      return <Loader title="Loading DATA..." />;
    }
    dispatch(setActiveSong({ song, data, index }));
    dispatch(playPause(true));
  };

  if (isLoadingTopChart) return <Loader title="Loading get..." />;

  if (errorTopChart) return <Error />;

  const likes = dataTopChart["likes_leaderboard"];
  console.log("leader like ne");
  console.log(likes);
  const listens = dataTopChart["listens_leaderboard"];
  const dataLikes = Array.isArray(likes) ? likes : [likes];
  const dataListens = Array.isArray(listens) ? listens : [listens];

  // console.log("check favourite nha")
  // console.log(dataFavourite);
  // const datas = dataFavourite;
  // console.log("check favourite nha")
  // console.log(datas);

  // const LikedSong = Array.isArray(datas.favourite_songs) ? datas.favourite_songs : [datas.favourite_songs];
  // if (LikedSong) {
  //   {
  //     LikedSong.map((song, index) => {
  //       dispatch(setLikeSongId(song.played_song.name));
  //     })
  //   }

  // }

  return (
    <div className=" flex flex-col">
      <div className="w-full flex flex-col">
        <div className="w-full relative">
          <div
            className="h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgPlaylist})` }}></div>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold leading-tight animate-pulse ">
            LEADER BOARD
          </h3>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          {dataLikes?.map((song, index) => (
            <div
              className="flex flex-row items-center text-center"
              key={song.id}>
              <LeaderboardCard
                song={song}
                index={index}
                isPlaying={isPlaying}
                activeSong={activeSong}
                handlePauseClick={handlePauseClick}
                handlePlayClick={() => handlePlayClick(song, likes, index)}
              />
              {/* <div className='flex flex-row items-center hover:bg-gray-400/50 py-2 p-4 rounded-2xl cursor-pointer mb-2'>

                {isLogin === true &&
                  likedSongsId.includes(song.name) && <Liked className='mb-2 text-center' handleLike={() => handleLike(song.id, song.name)} />
                }
                {isLogin === true &&
                  !likedSongsId.includes(song.name) && <Like className='text-center' handleLike={() => handleLike(song.id, song.name)} />
                }
              </ div> */}

              <AddPlaylist songid={song.id} />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col mt-8 mb-10"></div>
    </div>
  );
};
debugger;
export default TopCharts;
