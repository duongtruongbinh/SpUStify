import { AddPlaylist } from "../components";
import { Dispatch, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCreatePlaylistMutation } from "../redux/services/CoreApi";

const CreatePlaylist = () => {
  const dispatch = useDispatch();

  const [playlistName, setPlaylistName] = useState("");

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImagePost, setUploadedImagePost] = useState("");

  const [uploadedBackground, setUploadedBackground] = useState(null);
  const [uploadedBackgroundPost, setUploadedBackgroundPost] = useState(null);

  const [setCreatePlaylist, { isLoading }] = useCreatePlaylistMutation();

  const handleInputImage = (e) => {
    if (!uploadedImage) {
      setUploadedImage(URL.createObjectURL(e.target.files[0]));
      setUploadedImagePost(e.target.files[0]);
    } else setUploadedImage(null);
  };

  const handleSubmit = async (event) => {
    //  event.preventDefault();
    event.preventDefault();

    const data = new FormData();
    data.append("avatar", uploadedImagePost);
    data.append("background_image", uploadedBackgroundPost);
    data.append("name", playlistName);
    data.append("status", "Public");

    try {
      const [{ request }] = dispatch(setCreatePlaylist(data));
      console.log(request);
    } catch (error) {
      console.log(error);
    }

    if (isLoading) {
      return <Loader title="Loading DATA..." />;
    }
  };

  const handleCancle = (e) => {};

  return (
    <div className="flex flex-col bg-[#2F303A] w-[70%] h-[80%] rounded-2xl mt-16 ml-44">
      <p className="flex items-center justify-center h-40 text-[#FFFFFF] text-2xl">
        Create playlist
      </p>

      <div className="flex space-x-16 items-center justify-center">
        <div className="h-48 w-48 flex items-center justify-center overflow-hidden border-dashed border-2 border-[#AEAEAE]">
          {!uploadedImage ? (
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
              src={uploadedImage}
              className="h-[192px] w-[192px] object-cover"
              onClick={handleInputImage}
            />
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="text-[#FAF6F6]">Playlist name</div>
          <input
            type="text"
            id="playlistname"
            className="bg-[#202027] w-80 rounded text-white focus:outline-none"
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <AddPlaylist />
        </div>
      </div>

      <div className="flex items-end h-40 pb-2 pr-2 justify-end">
        <button
          type="button"
          onClick={handleCancle}
          class="text-[#FFFFFF] bg-[#636669] hover:bg-[#2d2e2f] font-medium rounded-lg text-sm px-8 py-2.5 mr-2 mb-2">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          class="text-[#FFFFFF] bg-[#5291CC] hover:bg-[#20517f] font-medium rounded-lg text-sm px-8 py-2.5 mr-2 mb-2">
          Create
        </button>
      </div>
    </div>
  );
};

export default CreatePlaylist;
