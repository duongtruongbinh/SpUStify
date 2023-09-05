import { Dispatch, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { useGetPlaylistDetailsQuery } from "../redux/services/CoreApi";
import { editAction, getPlaylistDetails } from "../redux/services/Api";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
const urlToFile = async (url, fileName, mimeType) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName, { type: mimeType });
  } catch (error) {
    console.error("Error converting URL to File:", error);
    return null;
  }
};
const EditPlaylist = () => {
  const navigate = useNavigate();
  const { playlistid } = useParams();
  const { username, password } = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const [responseData, setResponseData] = useState();

  const [playlistName, setPlaylistName] = useState("");

  const [playlist, setPlaylist] = useState();
  const [state, setState] = useState('state');


  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImagePost, setUploadedImagePost] = useState(null);

  const [uploadedBackground, setUploadedBackground] = useState(null);
  const [uploadedBackgroundPost, setUploadedBackgroundPost] = useState(null);
  useEffect(() => {

    urlToFile(`http://127.0.0.1:8000${playlist?.background_image}`, "image.jpg", "image/jpeg")
      .then((file) => {
        if (file) {
          // Đã chuyển đổi thành công
          setUploadedBackgroundPost(file);
          // Bây giờ bạn có thể sử dụng đối tượng File này
        } else {
          // Xử lý lỗi nếu có
        }
      });

    urlToFile(`http://127.0.0.1:8000${playlist?.avatar}`, "image.jpg", ".jpeg .jpg .png")
      .then((file) => {
        if (file) {
          // Đã chuyển đổi thành công
          setUploadedImagePost(file);
          // Bây giờ bạn có thể sử dụng đối tượng File này
        } else {
          // Xử lý lỗi nếu có
        }
      });




    // Gửi formData lên server bằng axios hoặc phương thức khác
    // await axios.post("your-upload-endpoint", formData);


  }, [playlist]);

  useEffect(() => {


    setPlaylistName(playlist?.name);
    setUploadedBackground(
      `http://127.0.0.1:8000${playlist?.background_image}`
    );
    setUploadedImage(`http://127.0.0.1:8000${playlist?.avatar}`);
    setState("state-" + new Date().getTime());
  }, [playlist]);
  useEffect(() => {

    const fetchData = async () => {


      await getPlaylistDetails(username, password, playlistid).then(response => {
        setPlaylist(response.data);

        console.log(playlist);


      });

    }
    fetchData();
  }, []);

  const [isFormValid, setIsFormValid] = useState(true);

  const handleSubmit = async (event) => {
    //  event.preventDefault();
    event.preventDefault();

    if (isFormValid) {
      const data = new FormData();
      data.append("avatar", uploadedImagePost);
      data.append("background_image", uploadedBackgroundPost);

      data.append("name", playlistName);

      data.append("status", "pub");

      // setFormData(Data);
      // No need for the X-RapidAPI-Key header for local development
      try {
        editAction(
          username,
          password,
          playlistid,
          data,
          "playlist"
        ).then((response) => {
          setResponseData(response);
        })
        // if (responseData.avatar !== null) {
        //   navigate("/upload-song-succesfull");
        // }
      } catch (error) {
        console.log(error);
      }

      //   if (isLoading) {
      //     return <Loader title="Loading DATA..." />;
      //   }
    }
  };

  useEffect(() => {
    if (responseData !== undefined) {
      debugger
      if (responseData !== null) {
        navigate("/home");
      }
    }


  }, [responseData]);
  const handleImageUpload = (imageFile) => {
    if (imageFile) {
      setUploadedImage(URL.createObjectURL(imageFile));
      setUploadedImagePost(imageFile);
    }
    else {
      setUploadedImage(null);
      setUploadedImagePost("");
    }
  };

  const handleBackgroudUpload = (backgroundFile) => {
    if (backgroundFile) {
      setUploadedBackground(URL.createObjectURL(backgroundFile));
      setUploadedBackgroundPost(backgroundFile);
    }
    else {
      setUploadedBackground(null);
      setUploadedBackgroundPost("");
    }
  };

  return (
    <div className=" bg-grey_bg flex flex-col my-10 mx-5">
      <div className=" text-white flex my-10 justify-center ">
        Edit Playlist
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row h-1/2 my-8 mx-8 justify-center">
          <div className=" flex flex-row items-center justify-center gap-4 ">
            <div className="border border-dashed border-gray-300 h-[250px] w-[250px] flex flex-col items-center justify-center">
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

            <div className="border border-dashed border-gray-300 h-[250px] w-[250px] flex flex-col items-center justify-center">
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

          <div className=" ml-10 self-center flex flex-col w-2/5 gap-4 ">
            <div>
              <label className="text-white block mb-2">Playlist name</label>

              <input
                type="text"
                className="pl-2 text-white w-full h-12 rounded bg-near_black focus:outline-none focus:border-blue-500"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
              />

            </div>
          </div>
        </div>

        <div className="text-white my-10 flex flex-row gap-4 justify-end mr-20">
          <Button
            onClick={() => navigate("/playlist")}
            className="bg-cancel_grey hover:bg-gray-500 px-8 py-4 my-2 rounded-xl   text-white">
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-submit_blue hover:bg-sign_up_blue  px-8 py-4 my-2 rounded-xl   text-white">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPlaylist;
