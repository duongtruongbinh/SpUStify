import { useSelector, useDispatch } from "react-redux";
import {
  useLocation,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { setLikeSongId } from "./redux/features/playerSlice";
import {
  Searchbar,
  Sidebar,
  MusicPlayer,
  TopPlay,
  Loader,
  Error,
} from "./components";
import {
  SignIn,
  SignUp,
  ArtistDetails,
  TopArtists,
  FavouriteSong,
  HomePage,
  Search,
  SongDetails,
  TopCharts,
  CreatePlaylist,
  UploadSong,
  UploadSongSuccessfull,
  Profile,
  Playlist,
  PlaylistDetails,
  EditPlaylist,
} from "./pages";
import { useGetFavouriteSongsQuery } from "./redux/services/CoreApi";
import { setRegisterLogin } from "./redux/features/playerSlice";

const App = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (user) {
    dispatch(setRegisterLogin(user));
  }

  const { activeSong, isLogin } = useSelector((state) => state.player);

  const location = useLocation();
  const currentRoute = location.pathname;

  const isSongDetailPage =
    currentRoute.startsWith("/songs/") &&
    /^\d+$/.test(location.pathname.split("/")[2]);
  const isPlaylistDetailPage =
    currentRoute.startsWith("/playlist/") &&
    /^\d+$/.test(location.pathname.split("/")[2]);
  const noTopPlay = [
    "/top-charts",
    "/signin",
    "/signup",
    "/favourite-song",
    "/upload-song",
    "/create-playlist",
    "/upload-song-succesfull",
  ];

  const noMusicPlayer = ["/signin", "/signup"];
  return (
    <div className="relative flex">
      {!noMusicPlayer.includes(currentRoute) && <Sidebar />}

      <div className="flex-1 flex flex-col">
        {!noMusicPlayer.includes(currentRoute) && <Searchbar />}

        <div className="h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse bg-[#18181A]">
          <div className="flex-1 h-fit pb-40">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/top-artists" element={<TopArtists />} />
              <Route path="/top-charts" index element={<TopCharts />} />
              {isLogin && (
                <Route path="/favourite-song" element={<FavouriteSong />} />
              )}

              <Route path="/artists/:id" element={<ArtistDetails />} />
              <Route path="/songs/:songid" element={<SongDetails />} />
              <Route path="/search/:searchTerm" element={<Search />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              <Route path="/profile" element={<Profile />} />
              <Route path="/upload-song" element={<UploadSong />} />
              <Route
                path="/upload-song-succesfull"
                element={<UploadSongSuccessfull />}
              />
              <Route path="/create-playlist" element={<CreatePlaylist />} />
              <Route path="/playlist" element={<Playlist />} />

              <Route
                path="/playlist/:playlistid"
                element={<PlaylistDetails />}
              />
              <Route
                path="/playlist/:playlistid/edit"
                element={<EditPlaylist />}
              />
            </Routes>
          </div>
          <div className="xl:sticky relative top-0 h-fit">
            {!noTopPlay.includes(currentRoute) &&
              !isSongDetailPage &&
              !isPlaylistDetailPage && <TopPlay />}
          </div>
        </div>
      </div>

      {activeSong?.name && !noMusicPlayer.includes(currentRoute) && (
        <div className="absolute h-28 bottom-0 left-0 right-0 flex animate-slideup bg-[#1F1F22] z-10">
          <MusicPlayer />
        </div>
      )}
    </div>
  );
};

export default App;
