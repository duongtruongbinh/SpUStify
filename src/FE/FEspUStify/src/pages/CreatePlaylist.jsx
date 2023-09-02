import { AddPlaylist } from "../components";
import { Dispatch, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCreatePlaylistMutation } from "../redux/services/CoreApi";
import { Button } from '@material-tailwind/react';
import { useNavigate } from "react-router-dom";
const CreatePlaylist = () => {
  
  const navigate = useNavigate();


  const dispatch = useDispatch();

  const [playlistName, setPlaylistName] = useState('');
  const [PlaylistNameError, setPlaylistNameError] = useState('');



 


  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImagePost, setUploadedImagePost] = useState('');
  const [imageError, setImageError] = useState('');


  const [uploadedBackground, setUploadedBackground] = useState(null);
  const [uploadedBackgroundPost, setUploadedBackgroundPost] = useState(null);
  const [backgroundError, setBackgroundError] = useState('');


  const [isUploaded, setIsUploaded] = useState(false);


  const [isFormValid,setIsFormValid] = useState(true);

  const [setCreatePlaylist, { isLoading }] = useCreatePlaylistMutation();

  const handleSubmit = async (event) => {


      //  event.preventDefault();
      event.preventDefault();

      if (playlistName === '') {
        setPlaylistNameError('Song name is required');
          setIsFormValid(false);
      } else {
        setPlaylistNameError('');
      }
      if (uploadedBackgroundPost === null) {
          setBackgroundError('File song is required');
          setIsFormValid(false);
      } else {
          setBackgroundError('');
      }
      if (uploadedImagePost === null) {
          setImageError('Lyric of the song is required');
          setIsFormValid(false);

      } else {
          setImageError('');
      }
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
          

          try {

              const responseData = await setCreatePlaylist(data);

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

                              className="w-full h-12 rounded bg-near_black focus:outline-none focus:border-blue-500"
                              value={playlistName}
                              onChange={(e) => setPlaylistName(e.target.value)}
                          />
                          {PlaylistNameError && <p className="text-red-500">{PlaylistNameError}</p>}

                      </div>



                  


                  </div>

              </div>


              <div className="text-white my-10 flex flex-row gap-4 justify-end mr-20">
                  <Button className='bg-cancel_grey  px-8 py-4 my-2 rounded-xl   text-white'>Cancel</Button>
                  <Button type='submit' className='bg-submit_blue  px-8 py-4 my-2 rounded-xl   text-white'>Submit</Button>
              </div>
          </form>
      </div>
  );
};

export default CreatePlaylist;
