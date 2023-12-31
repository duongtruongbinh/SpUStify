import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import PlayPause from "./PlayPause";
import { playPause, setActiveSong } from "../redux/features/playerSlice";

import Na from "../assets/bg1.jpeg";
const PlaylistCard = ({ song, isPlaying, activeSong, index, data }) => {
  console.log("playlist id");
  console.log(song.id);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col w-[155px] h-[250px] animate-slideup rounded-md cursor-pointer shadow-xl  relative hover:bg-slate-400">
      <div className="rounded-md  relative h-[175px] w-full group bg-cover bg-no-repeat bg-center">
        <img
          // src={song.images?.coverart}
          src={`http://127.0.0.1:8000${song.avatar}`}
          alt="song_img"
          className="object-cover w-full h-full overflow-hidden "
        />
      </div>

      <div id="PlaylistItemDiv"  className="   w-full h-[80px] mb-0 flex flex-col relative    ">
        <p  id="PlaylistItemP" className="  ml-2 mt-4 font-bold z-100 text-lg text-gray-100 truncate">
          <Link id="PlaylistItemLink"  to={`/playlist/${song.id}`}>{song.name}</Link>
        </p>
        {/* <p className=' text-xs truncate text-gray-300 '>
          <Link to={song.song_artists
            ? `/artists/${song?.song_artists[0]?.adamid}`
            : '/top-artists'}
          >
            {song.song_artists[0]}
          </Link>
        </p> */}
      </div>
    </div>
  );
};

export default PlaylistCard;
