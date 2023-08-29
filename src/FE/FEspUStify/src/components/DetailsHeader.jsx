import React from "react";
import { Link } from "react-router-dom";
import Na from "../assets/Liu-Grace.jpeg";

const DetailsHeader = ({ artistId, songData }) => (
  <div className="relative w-full flex flex-col">
    <div
      className="w-full bg-gradient-to-l from-transparent to-violet-900 sm:h-48 h-28"
      style={{
        backgroundImage: `url(http://127.0.0.1:8000${songData.background_image})`,
      }}
    />

    <div className="absolute inset-0 flex items-center">
      <img
        alt="profile"
        src={`http://127.0.0.1:8000${songData.avatar}`}
        className="sm:w-48 w-28 sm:h-48 h-28 rounded-full object-cover border-2 shadow-xl shadow-black"
      />

      <div className="ml-5">
        <p className="font-bold sm:text-3xl text-xl text-gray-100">
          {songData?.name}
        </p>
        {!artistId && (
          <Link to={`/artists/${artistId}`}>
            <p className="text-base text-gray-300 mt-2">{songData?.name}</p>
          </Link>
        )}

        {/* <p className="text-base text-gray-300 mt-2">
        {songData.main_aritst.artist_name}
        </p> */}
      </div>
    </div>

    <div className="w-full sm:h-44 h-24" />
  </div>
);

export default DetailsHeader;
