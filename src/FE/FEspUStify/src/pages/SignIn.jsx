import { Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { logo, image1, image2, image3 } from "../assets";
import { Error, Loader, SongCard } from "../components";
//import { useLoginMutation } from "../redux/services/CoreApi";
import { Signin } from "../redux/services/Api";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setRegisterLogin } from "../redux/features/playerSlice";
import { useNavigate } from "react-router-dom";
const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();
  // const [login, { isLoading, error, data }] = useLoginMutation();
  const handleLogin = async (event) => {
    event.preventDefault();
    let hasError = false;

    if (!username) {
      setUsernameError("Username is required");
      hasError = true;
    } else {
      setUsernameError(""); // Đặt lại thông báo lỗi nếu input không rỗng
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else {
      setPasswordError(""); // Đặt lại thông báo lỗi nếu input không rỗng
    }

    if (hasError) {
      // Nếu có lỗi, không gọi API và hiển thị thông báo lỗi tổng quan
      setError("Please fill in all required fields.");
      return;
    }

    const userData = {
      "username": username,
      "password": password,
    };

    const response = await Signin(userData, username, password);
    console.log(response.data);

    // Gọi API đăng ký và unwrap kết quả

    if (response) {
      const useForSlice = {
        ...userData,
        isArtist: response.data?.is_artist,
        isLogin: true,
      };

      dispatch(setRegisterLogin(useForSlice));
      navigate("/home");
      sessionStorage.setItem("user", JSON.stringify(useForSlice));
    }
  };

  return (
    <div className=" gap-20  bg-bg_sign_up flex flex-row my-20 mx-20 py-20 px-20">
      <div className="w-1/2 flex flex-col mr-20">
        <div
          onClick={() => navigate("/home")}
          className="flex flex-row gap-6 hover:cursor-pointer">
          <img src={logo} className="h-20" />
          <p className="text-white text-2xl  self-center">SpUStify</p>
        </div>
        <p className=" text-sign_up_blue text-5xl my-10">Let's Sign Up</p>
        <p className="text-sign_up_now text-6xl font-bold mb-10">Now!</p>
        <div className="flex flex-row gap-6">
          <img className="w-[150px] h-[150px] " src={image1} />
          <img className="w-[150px] h-[150px] " src={image2} />

          <img className="w-[150px] h-[150px] " src={image3} />
        </div>
      </div>
      <div className="w-1/2  bg-form_sign_up px-12  ml-20 rounded-[10px] flex flex-col">
        <p className="text-white text-5xl mt-10 mb-5 self-center">SpUStify</p>
        <form onSubmit={handleLogin}>
          <div className="   flex flex-col  gap-4 ">
            <div>
              <label className="text-white block mb-2">User Name</label>

              <input
                id="usernameSignIn"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 border text-white border-input_blue bg-form_sign_up rounded-md h-10 w-full "
              />
              {usernameError && <p className="text-red-500">{usernameError}</p>}
            </div>

            <div>
              <label className="text-white block mb-2">Password</label>

              <input
                id="passwordSignIn"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border text-white border-input_blue bg-form_sign_up rounded-md h-10 w-full "
              />
              {passwordError && <p className="text-red-500">{passwordError}</p>}
            </div>
          </div>

          <div className="text-white my-10 flex flex-row gap-4 justify-center ">
            <Button
              id="signinInside"
              type="submit"
              className="bg-submit_blue hover:bg-sign_up_blue  px-8 py-4 my-2 rounded-xl   text-white">
              Sign In
            </Button>
          </div>
        </form>
        {error && <p className="text-red-500">{error}</p>}{" "}
        {/* Hiển thị thông báo lỗi */}
      </div>
    </div>
  );
};
export default SignIn;
