import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

import { createAction } from "../redux/services/Api";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import React from "react";
import { Loader } from "../components";
const UploadSong = () => {
  const navigate = useNavigate();
  const { username, password } = useSelector((state) => state.player);
  const dispatch = useDispatch();

  const [songName, setSongName] = useState("");
  const [songNameError, setSongNameError] = useState("");

  const [songFile, setFile] = useState("");
  const [songFileName, setFileName] = useState("");
  const [songFilePost, setFilePost] = useState("");
  const [songFileError, setFileError] = useState("");

  const [songLyric, setLyric] = useState("");
  const [songLyricFile, setLyricFile] = useState("");
  const [songLyricPost, setLyricPost] = useState("");
  const [songLyricError, setLyricError] = useState("");

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImagePost, setUploadedImagePost] = useState(null);

  const [uploadedBackground, setUploadedBackground] = useState(null);
  const [uploadedBackgroundPost, setUploadedBackgroundPost] = useState(null);

  const [isUploaded, setIsUploaded] = useState(false);

  const [isFormValid, setIsFormValid] = useState(true);
  const [responseData, setResponseData] = useState();

  const handleSubmit = async (event) => {
    //  event.preventDefault();
    event.preventDefault();

    if (songName === "") {
      setSongNameError("Song name is required");
      setIsFormValid(false);
    } else {
      setSongNameError("");
    }
    if (songFilePost === "") {
      setFileError("File song is required");
      setIsFormValid(false);
    } else {
      setFileError("");
    }
    if (songLyricPost === "") {
      setLyricError("Lyric of the song is required");
      setIsFormValid(false);
    } else {
      setLyricError("");
    }
    if (isFormValid) {
      const data = new FormData();
      data.append("avatar", uploadedImagePost);
      data.append("background_image", uploadedBackgroundPost);

      data.append("name", songName);

      data.append("song_file", songFilePost);
      data.append("lyric_file", songLyricPost);

      // setFormData(Data);
      // No need for the X-RapidAPI-Key header for local development

      try {
        createAction(username, password, data, "song").then((response) => {
          setResponseData(response.data);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    if (responseData !== undefined) {
      debugger;
      if (responseData.avatar !== null) {
        navigate("/home");
      }
    }
  }, [responseData]);
  const handleFileUploadAudio = (file) => {
    if (file) {
      setFile(URL.createObjectURL(file));
      setFilePost(file);
      setFileName(file.name);
    }
  };
  const handleFileUploadLyric = (file) => {
    if (file) {
      setLyric(URL.createObjectURL(file));
      setLyricPost(file);
      setLyricFile(file.name);
    }
  };
  const handleImageUpload = (imageFile) => {
    if (imageFile) {
      setUploadedImage(URL.createObjectURL(imageFile));
      setUploadedImagePost(imageFile);
    } else {
      setUploadedImage(null);
      setUploadedImagePost("");
    }
  };
  const handleBackgroudUpload = (backgroundFile) => {
    if (backgroundFile) {
      setUploadedBackground(URL.createObjectURL(backgroundFile));
      setUploadedBackgroundPost(backgroundFile);
    } else {
      setUploadedBackground(null);
      setUploadedBackgroundPost("");
    }
  };

  return (
    <div className=" bg-grey_bg flex flex-col my-10 mx-5">
      <div className=" text-white flex my-10 justify-center ">Upload Song</div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row h-1/2 my-8 mx-8 justify-center">
          <div class=" flex flex-row items-center justify-center gap-4 ">
            <div className="border border-dashed border-gray-300 p-4 h-[250px] w-[250px] flex flex-col items-center justify-center">
              {!uploadedImage ? (
                <>
                  <input
                    type="file"
                    id="avatar"
                    className="hidden"
                    accept=".jpg, .jpeg, .png, .gif"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />
                  <label
                    htmlFor="avatar"
                    className="flex flex-col items-center text-white hover:cursor-pointer">
                    <div className="text-white text-3xl">+</div>
                    Image
                  </label>
                </>
              ) : (
                <img
                  src={uploadedImage}
                  className="h-full w-full object-cover"
                  onClick={(e) => handleImageUpload(null)}
                />
              )}
            </div>

            <div className="border border-dashed border-gray-300 p-4 h-[250px] w-[250px] flex flex-col items-center justify-center">
              {!uploadedBackground ? (
                <>
                  <input
                    type="file"
                    id="background"
                    className="hidden"
                    accept=".jpg, .jpeg, .png, .gif"
                    onChange={(e) => handleBackgroudUpload(e.target.files[0])}
                  />
                  <label
                    htmlFor="background"
                    className="flex flex-col items-center text-white hover:cursor-pointer">
                    <div className="text-white text-3xl">+</div>
                    Background
                  </label>
                </>
              ) : (
                <img
                  src={uploadedBackground}
                  className="h-full w-full object-cover"
                  onClick={(e) => handleBackgroudUpload(null)}
                />
              )}
            </div>
          </div>

          <div className=" ml-10  flex flex-col w-2/5 gap-4 ">
            <div>
              <label className="text-white block mb-2">Song name</label>

              <input
                type="text"
                className="pl-2 text-white w-full h-10 rounded bg-near_black focus:outline-none focus:border-blue-500"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
              />
              {songNameError && <p className="text-red-500">{songNameError}</p>}
            </div>

            <div>
              <label className="text-white block mb-2">Song file</label>
              <div className="flex flex-row">
                <input
                  id="songfile"
                  type="file"
                  accept="audio/mp3"
                  className="hidden"
                  onChange={(e) => handleFileUploadAudio(e.target.files[0])}
                />
                <label
                  htmlFor="songfile"
                  className="overflow-hidden pt-2 text-center pl-2 text-white w-full h-10 rounded bg-near_black focus:outline-none focus:border-blue-500 hover:cursor-pointer">
                  {songFile ? songFileName : "File"}
                </label>
                {songFileError && (
                  <p className="text-red-500">{songFileError}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-white block mb-2">Lyric's file</label>
              <div className="flex flex-col">
                <input
                  id="lyricfile"
                  type="file"
                  accept=".txt, .pdf"
                  className="hidden"
                  onChange={(e) => handleFileUploadLyric(e.target.files[0])}
                />
                <label
                  htmlFor="lyricfile"
                  className="overflow-hidden pt-2 text-center pl-2 text-white w-full h-10 rounded bg-near_black focus:outline-none focus:border-blue-500 hover:cursor-pointer">
                  {songLyric ? songLyricFile : "File"}
                </label>
                {songLyricError && (
                  <p className="text-red-500 flex">{songLyricError}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-white my-10 flex flex-row gap-4 justify-end mr-20">
          <Button
            onClick={() => navigate("/home")}
            className="bg-cancel_grey  px-8 py-4 my-2 rounded-xl   text-white">
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-submit_blue  px-8 py-4 my-2 rounded-xl   text-white">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
export default UploadSong;
