import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
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

import { getPlaylist, playSong } from "../redux/services/Api";
import { setActiveSong } from "../redux/features/playerSlice";
import { playPause } from "../redux/features/playerSlice";

const Playlist = () => {
  const [startIndexSong, setStartIndexSong] = useState(0);
  const [endIndexSong, setEndIndexSong] = useState(4);
  const [startIndexPlaylist, setStartIndexPlaylist] = useState(0);
  const [endIndexPlaylist, setEndIndexPlaylist] = useState(4);

  const dispatch = useDispatch();
  const { activeSong, isPlaying, currentSongs, username, password } =
    useSelector((state) => state.player);
  const [state, setState] = useState("state");

  const [playlist, setPlaylist] = useState([]);
  const [DataFav, setDataFav] = useState([]);
  useEffect(() => {
    const fetchData = async () => {


      await getPlaylist(username, password).then(response => {
        setDataFav(response.data);

      })
        ;

    }


    fetchData();
  }, [state]);
  useEffect(() => {

    if (DataFav !== undefined && Array.isArray(DataFav)) {
      setPlaylist(DataFav);

    }


  }, [DataFav]);



  useEffect(() => {
    // Thay đổi key khi component được mount lại hoặc focus
    setState("state-" + new Date().getTime());

  }, []);

  return (
    <div className="flex flex-col space-y-2">
      <div className="pl-28 mb-2 w-full flex justify-between items-center sm:flex-row flex-col">
        <div className="text-5xl text-gray-100 text-left">
          MY PLAYLIST
          {/* {genreTitle} */}
        </div>
      </div>

      <div className="pl-28">
        <div className="border border-dashed border-gray-300 h-[180px] w-[180px] flex flex-col items-center justify-center mb-5">
          <Link
            className="flex flex-col items-center justify-center"
            to={"/create-playlist"}>
            <div  id= "DivcreatePlaylist" className="text-white text-5xl">+</div>
            <p id= "PcreatePlaylist"className="text-white">Create Playlist</p>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="  relative flex flex-wrap sm:justify-start justify-center gap-8">
          {playlist?.map((song, index) => (
            <PlaylistCard
              key={song.id}
              song={song}
              isPlaying={isPlaying}
              activeSong={activeSong}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
