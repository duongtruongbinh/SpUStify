import { AddPlaylist } from "../components";
import { Dispatch, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCreatePlaylistMutation } from "../redux/services/CoreApi";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const CreatePlaylist = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { username, password } = useSelector((state) => state.player);

    const [playlistName, setPlaylistName] = useState("");
    const [PlaylistNameError, setPlaylistNameError] = useState("");

    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedImagePost, setUploadedImagePost] = useState("");
    const [imageError, setImageError] = useState("");

    const [uploadedBackground, setUploadedBackground] = useState(null);
    const [uploadedBackgroundPost, setUploadedBackgroundPost] = useState(null);
    const [backgroundError, setBackgroundError] = useState("");

    const [isUploaded, setIsUploaded] = useState(false);

    const [isFormValid, setIsFormValid] = useState(true);
    const { mutate: createPlaylistMutation } = useCreatePlaylistMutation();
    const [setCreatePlaylist, { isLoading }] = useCreatePlaylistMutation();

    const handleSubmit = async (event) => {
        //  event.preventDefault();
        event.preventDefault();

        if (playlistName === "") {
            setPlaylistNameError("Song name is required");
            setIsFormValid(false);
        } else {
            setPlaylistNameError("");
        }
        if (uploadedBackgroundPost === null) {
            setBackgroundError("File song is required");
            setIsFormValid(false);
        } else {
            setBackgroundError("");
        }
        if (uploadedImagePost === null) {
            setImageError("Lyric of the song is required");
            setIsFormValid(false);
        } else {
            setImageError("");
        }
        if (isFormValid) {
            const data = new FormData();
            data.append("avatar", uploadedImagePost);
            data.append("background_image", uploadedBackgroundPost);

            data.append("name", playlistName);

            data.append("status", "pub");


            debugger
            // Thực hiện mutation và sử dụng username từ Redux Store
            const token = btoa(decodeURIComponent(encodeURIComponent(`${username}:${password} `)));
            // Encode the username and password
            debugger
            const header = ('Authorization', `Basic ${token}`);

            // setFormData(Data);
            // No need for the X-RapidAPI-Key header for local development

            try {
                // const responseData = await setCreatePlaylist(data);
                axios.post('http://localhost:8000/api/playlists/create', data, {
                    auth: {
                        username: username,
                        password: password
                    }

                })
                    .then((response) => {
                        // Xử lý kết quả sau khi POST thành công
                        console.log('Playlist created successfully', response.data);
                    })
                    .catch((error) => {
                        // Xử lý lỗi khi POST request thất bại
                        console.error('Error creating playlist', error);
                    });

                if (responseData.avatar !== null) {
                    navigate("/upload-song-succesfull");
                }
            } catch (error) {
                console.log(error);
            }

            // if (isLoading) {
            //   return <Loader title="Loading DATA..." />;
            // }
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
        <div className=" bg-grey_bg flex flex-col my-10 mx-5 rounded-xl">
            <div className=" text-white flex my-10 justify-center text-2xl ">
                Create Playlist
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-row h-1/2 my-8 mx-8 justify-center">
                    <div class=" flex flex-row items-center justify-center gap-4 ">
                        <div className="border border-dashed border-gray-300 h-[250px] w-[250px] flex flex-col items-center justify-center">
                            {!uploadedImage ? (
                                <>
                                    <input
                                        type="file"
                                        id="html"
                                        className="hidden"
                                        accept=".jpg, .jpeg, .png, .gif"
                                        onChange={(e) => handleImageUpload(e.target.files[0])}
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
                                        id="html"
                                        className="hidden"
                                        accept=".jpg, .jpeg, .png, .gif"
                                        onChange={(e) => handleBackgroudUpload(e.target.files[0])}
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
                            {PlaylistNameError && (
                                <p className="text-red-500">{PlaylistNameError}</p>
                            )}
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

export default CreatePlaylist;
