import { Button } from "@material-tailwind/react";

import { useCreateSongMutation } from "../redux/services/CoreApi";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "react";
import { useState, useEffect } from "react";
import React from "react";
import { Loader } from "../components";
import axios from "axios";

const UploadSong = () => {
  const dispatch = useDispatch();

  const [songName, setSongName] = useState("");
  const [songFile, setFile] = useState("");
  const [songFilePost, setFilePost] = useState("");

  const [songLyric, setLyric] = useState("");
  const [songLyricPost, setLyricPost] = useState("");

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImagePost, setUploadedImagePost] = useState("");

  const [uploadedBackground, setUploadedBackground] = useState(null);
  const [uploadedBackgroundPost, setUploadedBackgroundPost] = useState(null);

  const [formData, setFormData] = useState(new FormData());

  const [setCreateSong, { isLoading }] = useCreateSongMutation();

  const handleSubmit = async (event) => {
    //  event.preventDefault();
    event.preventDefault();

    const data = new FormData();
    data.append("avatar", uploadedImagePost);
    data.append("background_image", uploadedBackgroundPost);
    // Data.append('avatar', uploadedImagePost.target.files[0]);
    // Data.append('background_image', uploadedBackgroundPost.name);
    data.append("name", songName);

    data.append("song_file", songFilePost);
    data.append("lyric_file", songLyricPost);
    // Data.append('song_file', songFilePost.name);
    // Data.append('lyric_file', songLyricPost.name);
    // for (const entry of Data.entries()) {
    //     console.log(entry[0], entry[1]);
    // }

    // setFormData(Data);
    // No need for the X-RapidAPI-Key header for local development
    const token = btoa("h3:Acccuah3"); // Encode the username and password

    //var options = { content: formData };
    // try {
    //     const test = await axios({
    //         url: "http://127.0.0.1:8000/api/songs/create",
    //         method: "post",
    //         data: data,
    //         headers: {
    //             'Authorization': `Basic ${token}`,
    //             // content: data
    //         },
    //     //   options
    //     });
    // } catch (error) {
    //     debugger;
    // }

    try {
      const [{ request }] = dispatch(setCreateSong(data));
      console.log(request);
    } catch (error) {
      console.log(error);
    }

    if (isLoading) {
      return <Loader title="Loading DATA..." />;
    }
  };
  const handleFileUploadAudio = (file) => {
    if (file) {
      setFile(URL.createObjectURL(file));
      setFilePost(file);
      // const selectedFile = file;
      // const reader = new FileReader();

      // reader.onload = () => {
      //     setFilePost(reader.result);
      // };

      // if (selectedFile) {
      //     reader.readAsDataURL(selectedFile);
      // }
    }
  };
  const handleFileUploadLyric = (file) => {
    if (file) {
      setLyric(URL.createObjectURL(file));
      setLyricPost(file);
      // const selectedFile = file;
      // const reader = new FileReader();

      // reader.onload = () => {
      //     setLyricPost(reader.result);
      // };

      // if (selectedFile) {
      //     reader.readAsText(selectedFile);
      // }
    }
  };
  const handleImageUpload = (imageFile) => {
    if (imageFile) {
      setUploadedImage(URL.createObjectURL(imageFile));
      setUploadedImagePost(imageFile);
      // const selectedFile = imageFile;

      // const reader = new FileReader();

      // reader.onload = () => {
      //     setUploadedImagePost(reader.result);
      // };

      // if (selectedFile) {
      //     reader.readAsDataURL(selectedFile);
      // }
    }
  };
  const handleBackgroudUpload = (backgroundFile) => {
    if (backgroundFile) {
      setUploadedBackground(URL.createObjectURL(backgroundFile));
      setUploadedBackgroundPost(backgroundFile);
      // const selectedFile = imageFile;
      // const reader = new FileReader();

      // reader.onload = () => {
      //     setUploadedBackgroundPost(reader.result);
      // };

      // if (selectedFile) {
      //     reader.readAsDataURL(selectedFile);
      // }
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
              </div>
            </div>

            <div>
              <label className="text-white block mb-2">Lyric's file</label>
              <div className="flex flex-row">
                <input
                  type="file"
                  accept=".txt, .pdf"
                  className="w-full h-12 bg-near_black rounded focus:outline-none focus:border-blue-500"
                  onChange={(e) => handleFileUploadLyric(e.target.files[0])}
                />
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
export default UploadSong;
