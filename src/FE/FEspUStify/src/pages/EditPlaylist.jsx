import { AddPlaylist } from "../components";
import { Dispatch, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { useEditPlaylistMutation, useGetPlaylistDetailsQuery } from "../redux/services/CoreApi";
import { Button } from '@material-tailwind/react';
import { useNavigate } from "react-router-dom";
const EditPlaylist = () => {
  
  const navigate = useNavigate();
  const  {playlistid} = useParams();
console.log("checl playlistid")
console.log(playlistid)

  const dispatch = useDispatch();

  const [playlistName, setPlaylistName] = useState('');


  const { data: songData, isFetching: isFetchingSongDetails } =
  useGetPlaylistDetailsQuery({ playlistid });
  const [setEditPlaylist, { isLoading }] = useEditPlaylistMutation();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImagePost, setUploadedImagePost] = useState('');
 


  const [uploadedBackground, setUploadedBackground] = useState(null);
  const [uploadedBackgroundPost, setUploadedBackgroundPost] = useState(null);
 

  if (isFetchingSongDetails) return <Loader title="Searching song details" />;
   useEffect(() => {
    if(songData){
        setPlaylistName(songData.name);
        setUploadedBackground(`http://127.0.0.1:8000${songData.background_image}`);
        setUploadedImage(`http://127.0.0.1:8000${songData.avatar}`);
    }
   },[]);


  

  const [isUploaded, setIsUploaded] = useState(true);


  const [isFormValid,setIsFormValid] = useState(true);

 

  const handleSubmit = async (event) => {


      //  event.preventDefault();
      event.preventDefault();

      
      if (isFormValid) {
          const data = new FormData();
          data.append(
              "avatar",
              uploadedImagePost,
          );
          data.append('background_image', uploadedBackgroundPost);

          data.append('name', playlistName);

          data.append('status', 'pub');
          


          // setFormData(Data);
          // No need for the X-RapidAPI-Key header for local development
          
debugger
          try {

              const responseData = await setEditPlaylist({playlistid,data});
debugger
              if (responseData.avatar !== null) {
                  navigate('/upload-song-succesfull');
              }

          }
          catch (error) {
              console.log(error);
          }

          if (isLoading) {
              return <Loader title='Loading DATA...' />
          }
      }





  };


  const handleImageUpload = (imageFile) => {
      if (imageFile) {


          setUploadedImage(URL.createObjectURL(imageFile));
          setUploadedImagePost(imageFile)

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

          <div className=" text-white flex my-10 justify-center ">Create Playlist</div>
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
                          {uploadedImage && <img src={uploadedImage} alt="Uploaded" className="object-cover w-full h-full border border-gray-400"
                          />}
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
                          {uploadedBackground && <img src={uploadedBackground} alt="Uploaded" className="object-cover w-full h-full border border-gray-400"
                          />}
                      </div>
                  </div>

                  <div className=" ml-10 self-center flex flex-col w-2/5 gap-4 ">

                      <div>
                          <label className="text-white block mb-2">Playlist name</label>

                          <input
                              type="text"

                              className="w-full h-12 text-white rounded bg-near_black focus:outline-none focus:border-blue-500"
                              value={playlistName}
                              onChange={(e) => setPlaylistName(e.target.value)}
                          />
                        

                      </div>



                  


                  </div>

              </div>


              <div className="text-white my-10 flex flex-row gap-4 justify-end mr-20">
                  <Button className='bg-cancel_grey  px-8 py-4 my-2 rounded-xl   text-white'>Cancel</Button>
                  <Button type='submit' className='bg-submit_blue  px-8 py-4 my-2 rounded-xl   text-white'>ENTER</Button>
              </div>
          </form>
      </div>
  );
};

export default EditPlaylist;
