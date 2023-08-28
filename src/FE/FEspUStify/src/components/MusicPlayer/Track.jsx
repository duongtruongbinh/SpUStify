import React from "react";

const Track = ({ isPlaying, isActive, activeSong }) => (
  <div className="flex-1 flex items-center justify-start">
    <div className="hidden sm:block h-16 w-16 mr-4">
      <img
        src={`http://127.0.0.1:8000${activeSong?.avatar}`}
        alt="cover art"
        className="h-16 w-16 rounded object-cover"
      />
    </div>
    <div className="w-[50%]">
      <p className="truncate text-gray-100 font-bold text-lg">
        {activeSong?.name ? activeSong?.name : "No active Song"}
      </p>
      <p className="truncate text-gray-300">
        {activeSong ? activeSong.main_artist.artist_name : "No active Song"}
      </p>
    </div>
  </div>
);

export default Track;
