import { MdOutlinePlaylistAdd } from "react-icons/md";
import { useEffect, useState } from "react";
// import { useGetPlaylistsQuery } from "../redux/services/CoreApi";
import { addSongToPlaylist } from "../redux/services/Api";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { getMyPlaylists } from "../redux/services/Api";

const Popup = ({ username, password, data, songid, onClick }) => {
  const playlistList = data;
  console.log("data add");
  console.log(playlistList);

  const handleaddSong = async ({ songid, playlist }) => {
    const id = playlist.id;
    try {
      const response = await addSongToPlaylist(username, password, songid, id);
      // if (response.data.message === "Song added to playlist successfully.") {
      //   toast.success(`Add Song to ${playlistList.name} successfully`, {
      //     position: toast.POSITION.TOP_CENTER,
      //     autoClose: 3000, // Thời gian tự động đóng thông báo (3 giây)
      //   });
      // }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="justify-center items-center flex overflow-auto fixed inset-0 z-50">
        <div className="relative w-auto mx-auto">
          {/*content*/}
          <div className="w-96 h-48 rounded-lg shadow-lg relative flex flex-col bg-white">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-xl font-semibold">Add song to a playlist</h3>
              <button className="ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
                <span
                  onClick={onClick}
                  className="flex items-center justify-center bg-transparent text-black h-6 w-6 text-2xl outline-none focus:outline-none">
                  <p>×</p>
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="hide-scrollbar overflow-auto relative p-6 space-y-2">
              {playlistList?.map((playlist, index) => (
                <div
                  key={index}
                  onClick={() => handleaddSong({ songid, playlist })}
                  className="text-center rounded-sm outline hover:text-white hover:bg-slate-500">
                  {playlist.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const AddPlaylist = ({ songid }) => {
  const [showModal, setShowModal] = useState(false);
  const [playlist, setPlaylist] = useState();
  const { username, password } = useSelector((state) => state.player);
  // const { data, isFetching, error } = useGetPlaylistsQuery({ key: showModal });

  useEffect(() => {
    const fetchData = async () => {
      await getMyPlaylists(username, password).then((response) => {
        setPlaylist(response.data);
        console.log(playlist);
      });
    };

    fetchData();
  }, []);
  return (
    <div className="p-4">
      <MdOutlinePlaylistAdd
        onClick={() => setShowModal(true)}
        className="hover:cursor-pointer"
        size={30}
        style={{ color: "white" }}></MdOutlinePlaylistAdd>

      {showModal ? (
        <Popup
          data={playlist}
          onClick={() => {
            setShowModal(false);
          }}
          songid={songid}
        />
      ) : null}
    </div>
  );
};
export default AddPlaylist;
