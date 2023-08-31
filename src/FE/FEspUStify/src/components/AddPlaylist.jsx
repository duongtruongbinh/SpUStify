import { MdOutlinePlaylistAdd } from "react-icons/md";
import { useState, useRef, useEffect } from "react";

const Popup = (props) => {
  return (
    <>
      <div className="justify-center items-center flex overflow-auto fixed inset-0 z-50">
        <div className="relative w-auto mx-auto">
          {/*content*/}
          <div className=" w-96 h-48 rounded-lg shadow-lg overflow-auto relative flex flex-col bg-white">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-xl font-semibold">Add song to a playlist</h3>
              <button
                className="ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={props.onClick}>
                <span className="flex items-center justify-center bg-transparent text-black h-6 w-6 text-2xl outline-none focus:outline-none">
                  <p>×</p>
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6">
              {
                // Playlist details
              }
              <div>Haha</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const AddPlaylist = ({ user, song }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <MdOutlinePlaylistAdd
        onClick={() => setShowModal(true)}
        className="hover:cursor-pointer"
        size={30}
        style={{ color: "white" }}></MdOutlinePlaylistAdd>

      {showModal ? (
        <Popup
          onClick={() => {
            setShowModal(false);
          }}
        />
      ) : null}
    </>
  );
};
export default AddPlaylist;
