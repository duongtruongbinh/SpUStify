import React from "react";

import PlayPause from "./PlayPause";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DetailsHeader = ({
  artistId,
  songData,
  handlePauseClick,
  handlePlayClick,
}) => {
  const { activeSong, isPlaying, isArtist } = useSelector(
    (state) => state.player
  );
  const navigate = useNavigate();
  return (
    <div className="relative w-full flex flex-col">
      <div
        className="w-full bg-gradient-to-l from-transparent to-violet-900 sm:h-48 h-28"
        style={{
          backgroundImage: `url(http://127.0.0.1:8000${songData?.background_image})`,
        }}
      />

      <div className="absolute inset-0 flex items-center">
        <img
          alt="profile"
          src={`http://127.0.0.1:8000${songData?.avatar}`}
          className="sm:w-48 w-28 sm:h-48 h-28 rounded-full object-cover border-2 shadow-xl shadow-black"
        />

        <div className="ml-5 flex flex-row items-center gap-6">
          <div>
            <p className="font-bold sm:text-3xl text-xl text-gray-100">
              {songData?.name}
            </p>
            <p
              onClick={() => navigate(`/artists/${songData?.main_artist.id}`)}
              className="text-white hover:cursor-pointer">
              {songData?.main_artist.artist_name}
            </p>
          </div>

          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={songData}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
      </div>

      <div className="w-full sm:h-44 h-24" />
    </div>
  );
};
export default DetailsHeader;
