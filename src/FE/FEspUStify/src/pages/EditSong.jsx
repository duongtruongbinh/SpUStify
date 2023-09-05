import { Button } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";

import {  } from "../redux/services/Api";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import React from "react";
import { Loader } from "../components";
import { getSongDetails,editAction } from "../redux/services/Api";
const EditSong = () => {
  const navigate = useNavigate();
  const { songid} = useParams();

  const { username, password } = useSelector((state) => state.player);
  const dispatch = useDispatch();

  const [songName, setSongName] = useState("");
  const [songNameError, setSongNameError] = useState("");

  const [songFile, setFile] = useState("");
  const [songFilePost, setFilePost] = useState("");
  const [songFileError, setFileError] = useState("");

  const [songLyric, setLyric] = useState("");
  const [songLyricPost, setLyricPost] = useState("");
  const [songLyricError, setLyricError] = useState("");

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImagePost, setUploadedImagePost] = useState(null);

  const [uploadedBackground, setUploadedBackground] = useState(null);
  const [uploadedBackgroundPost, setUploadedBackgroundPost] = useState(null);

  const [isUploaded, setIsUploaded] = useState(false);
  const [state, setState] = useState('state');

  const [isFormValid, setIsFormValid] = useState(true);
  const [responseData, setResponseData] = useState();
  const [songData, setSongData] = useState();
  
  useEffect(() => {
    
    
    setSongName(songData?.name);
    setUploadedBackground(
      `http://127.0.0.1:8000${songData?.songs.background_image}`
    );
    setUploadedImage(`http://127.0.0.1:8000${songData?.songs.avatar}`);
    setFile( `http://127.0.0.1:8000${songData?.songs.song_file}`);
    setState("state-" + new Date().getTime());
}, []);
useEffect(() => {
    
    const fetchData = async () => {
      

      await getSongDetails(username, password, songid).then(response => {
        setSongData(response.data);
        
        console.log(playlist);
   

      });

    }
    fetchData();
  }, [state]);
   
   
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
        editAction(username, password,songid, data, "song").then((response) => {
          setResponseData(response.data);
        })

      } catch (error) {
        console.log(error);
      }

     
    }
  };
  useEffect(() => {
    if (responseData !== undefined) {
      debugger
      if (responseData.avatar !== null) {
        navigate("/home");
      }
    }


  }, [responseData]);
  const handleFileUploadAudio = (file) => {
    if (file) {
      setFile(URL.createObjectURL(file));
      setFilePost(file);
    }
  };
  const handleFileUploadLyric = (file) => {
    if (file) {
      setLyric(URL.createObjectURL(file));
      setLyricPost(file);
    }
  };
  const handleImageUpload = (imageFile) => {
    if (imageFile) {
      setUploadedImage(URL.createObjectURL(imageFile));
      setUploadedImagePost(imageFile);
    }
  };
  const handleBackgroudUpload = (backgroundFile) => {
    if (backgroundFile) {
      setUploadedBackground(URL.createObjectURL(backgroundFile));
      setUploadedBackgroundPost(backgroundFile);
    }
  };

  return (
    <div className=" bg-grey_bg flex flex-col my-10 mx-5">
      <div className=" text-white flex my-10 justify-center ">Upload Song</div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row h-1/2 my-8 mx-8 justify-center">
          <div class=" flex flex-row items-center justify-center gap-4 ">
            <div className="border border-dashed border-gray-300 p-4 h-[250px] w-[250px] flex flex-col items-center justify-center">
              <label className="cursor-pointer rounded-md py-2 px-2 bg-white">
                Choose image
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png, .gif"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
              {uploadedImage && (
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="object-cover w-full h-full border border-gray-400"
                />
              )}
            </div>

            <div className="border border-dashed border-gray-300 p-4 h-[250px] w-[250px] flex flex-col items-center justify-center">
              <label className="cursor-pointer rounded-md bg-white py-2 px-2  items-center">
                Choose background
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png, .gif"
                  onChange={(e) => handleBackgroudUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
              {uploadedBackground && (
                <img
                  src={uploadedBackground}
                  alt="Uploaded"
                  className="object-cover w-full h-full border border-gray-400"
                />
              )}
            </div>
          </div>

          <div className=" ml-10  flex flex-col w-2/5 gap-4 ">
            <div>
              <label className="text-white block mb-2">Song name</label>

              <input
                type="text"
                className="w-full h-12 rounded bg-near_black focus:outline-none focus:border-blue-500"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
              />
              {songNameError && <p className="text-red-500">{songNameError}</p>}
            </div>

            <div>
              <label className="text-white block mb-2">Song file</label>
              <div className="flex flex-row">
                <input
                  type="file"
                  accept="audio/mp3"
                  className="w-full h-12 bg-near_black rounded focus:outline-none focus:border-blue-500"
                  onChange={(e) => handleFileUploadAudio(e.target.files[0])}
                />
                {songFileError && (
                  <p className="text-red-500">{songFileError}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-white block mb-2">Lyric's file</label>
              <div className="flex flex-col">
                <input
                  type="file"
                  accept=".txt, .pdf"
                  className="w-full h-12 bg-near_black rounded focus:outline-none focus:border-blue-500"
                  onChange={(e) => handleFileUploadLyric(e.target.files[0])}
                />
                {songLyricError && (
                  <p className="text-red-500 flex">{songLyricError}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-white my-10 flex flex-row gap-4 justify-end mr-20">
          <Button className="bg-cancel_grey  px-8 py-4 my-2 rounded-xl   text-white">
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
export default EditSong;