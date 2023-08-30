import { AddPlaylist } from "../components";
import React, { useState } from "react";

const CreatePlaylist = () => {
  const [file, setFile] = useState(null);
  const handleInputImage = (e) => {
    if (!file) setFile(URL.createObjectURL(e.target.files[0]));
    else setFile(null);
  };

  return (
    <div className="flex flex-col bg-[#2F303A] w-[70%] h-[80%] rounded-2xl mt-16 ml-44">
      <p className="flex items-center justify-center h-40 text-[#FFFFFF] text-2xl">
        Create playlist
      </p>

      <div className="flex space-x-16 items-center justify-center">
        <div className="h-48 w-48 flex items-center justify-center overflow-hidden border-dashed border-2 border-[#AEAEAE]">
          {!file ? (
            <>
              <input
                type="file"
                id="html"
                className="hidden"
                onChange={handleInputImage}
                accept="image/png, image/jpeg"
              />
              <label
                htmlFor="html"
                className="flex flex-col items-center text-white hover:cursor-pointer">
                <div className="text-white text-3xl">+</div>
                Image
              </label>
            </>
          ) : (
            <img
              src={file}
              className="h-[192px] w-[192px] object-cover"
              onClick={handleInputImage}
            />
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="text-[#FAF6F6]">Playlist name</div>
          <input
            type="text"
            name="uploadfile"
            className="bg-[#202027] w-80 rounded text-white focus:outline-none"
          />
          <AddPlaylist />
        </div>
      </div>

      <div className="flex items-end h-40 pb-2 pr-2 justify-end">
        <button
          type="button"
          class="text-[#FFFFFF] bg-[#636669] hover:bg-[#2d2e2f] font-medium rounded-lg text-sm px-8 py-2.5 mr-2 mb-2">
          Cancel
        </button>
        <button
          type="button"
          class="text-[#FFFFFF] bg-[#5291CC] hover:bg-[#20517f] font-medium rounded-lg text-sm px-8 py-2.5 mr-2 mb-2">
          Create
        </button>
      </div>
    </div>
  );
};

export default CreatePlaylist;
