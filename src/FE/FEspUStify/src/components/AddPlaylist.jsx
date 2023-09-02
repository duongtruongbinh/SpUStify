import { MdOutlinePlaylistAdd } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { useGetPlaylistsQuery } from "../redux/services/CoreApi";
import { useAddSongToPlaylistMutation } from "../redux/services/CoreApi";
const Popup = ({data, songid}) => {
  const playlistList =data;
  console.log("data add");
  console.log(playlistList);
  const [setAddSong, { isLoading: isLoadingAdd, responseAdd }] =useAddSongToPlaylistMutation();
  const handleaddSong = ({songid, playlist}) => {
    console.log("check")
    console.log(songid)
    debugger
    const id = {
      "playlist_id": playlist.id
    }
    debugger
    console.log(id)
    try {
        const response = setAddSong({songid,id});
    } catch(error){
        console.log(error)
    }

}
  return (
    <>
      <div className="justify-center items-center flex overflow-auto fixed inset-0 z-50">
        <div className="relative w-auto mx-auto">
          {/*content*/}
          <div className="hide-scrollbar w-96 h-48 rounded-lg shadow-lg overflow-auto relative flex flex-col bg-white">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-xl font-semibold">Add song to a playlist</h3>
              <button
                className="ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                >
                <span className="flex items-center justify-center bg-transparent text-black h-6 w-6 text-2xl outline-none focus:outline-none">
                  <p>×</p>
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 space-y-2">
              {playlistList?.map((playlist,index) => (
                <div
                  key={index}
                  onClick={()=> handleaddSong({songid, playlist})}
                
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

const AddPlaylist = ({  songid}) => {
  const [showModal, setShowModal] = useState(false);
  const { data, isFetching, error } = useGetPlaylistsQuery();
console.log("check ở đây");
console.log(songid)
  return (
    <>
      <MdOutlinePlaylistAdd
        onClick={() => setShowModal(true)}
        className="hover:cursor-pointer"
        size={30}
        style={{ color: "white" }}></MdOutlinePlaylistAdd>

      {showModal ? (
        <Popup
          data={data}
          onClick={() => {
            setShowModal(false);
          }}
        songid = {songid}
         
          
        />
      ) : null}
    </>
  );
};
export default AddPlaylist;
