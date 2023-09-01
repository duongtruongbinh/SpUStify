import { Button } from "@material-tailwind/react";
import { useSelector } from 'react-redux';
import { logo , image1, image2, image3} from "../assets";
import { Error, Loader, SongCard } from '../components';
import { useLoginMutation} from '../redux/services/CoreApi';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setRegisterLogin } from "../redux/features/playerSlice";
import { useNavigate } from 'react-router-dom';
const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [login, { isLoading, error, data }] = useLoginMutation();
    const handleLogin =  async (event) => {
      event.preventDefault();
        const userData = {
         "username": username,
          "password": password,
          
          
        };
        
        debugger
        
        const response = await login(userData);
       console.log(response.data)
        debugger
         // Gọi API đăng ký và unwrap kết quả
        
        if (isLoading) return <Loader title='Sending' />;
        if (error) return <Error />;
        
          if(response.data){
            const useForSlice = {
              ...userData,
              "isArtist": response.data.is_artist,
              "isLogin": true
            }
            dispatch(setRegisterLogin(useForSlice));
            navigate('/home')
          }
      };
      const handleArtist = () => {
        setIsArtist(true);
      }
    return (
      <div className=" gap-20  bg-bg_sign_up flex flex-row my-20 mx-20 py-20 px-20">
         <div className="w-1/2 flex flex-col mr-20">
<div className="flex flex-row gap-6">
  <img src = {logo} className="h-20" />
  <p className="text-white text-2xl  self-center">SpUStify</p>
</div>
<p className=" text-sign_up_blue text-5xl my-10">Let's Sign Up</p>
<p className="text-sign_up_now text-6xl font-bold mb-10">Now!</p>
<div className="flex flex-row gap-6">
<img className="w-[150px] h-[150px] "src={image1} />
<img className="w-[150px] h-[150px] " src={image2} />

<img className="w-[150px] h-[150px] " src={image3} />


</div>
         </div>
         <div className="w-1/2  bg-form_sign_up px-12  ml-20 rounded-[10px] flex flex-col">
         <p className="text-white text-5xl mt-10 mb-5 self-center">SpUStify</p>
         <form onSubmit={handleLogin} >
                
              

                    <div className="   flex flex-col  gap-4 ">

                        <div>
                            <label className="text-white block mb-2">User Name</label>

                            <input
                             type="text"
                             value={username}
                             onChange={(e) => setUsername(e.target.value)}
                          className="border text-white border-input_blue bg-form_sign_up rounded-md h-10 w-full "    
                            />


                        </div>


                        <div>
                            <label className="text-white block mb-2">Password</label>

                            <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          className="border text-white border-input_blue bg-form_sign_up rounded-md h-10 w-full "    
                            />


                        </div>



                    </div>

                


                <div className="text-white my-10 flex flex-row gap-4 justify-center ">

                    <Button type='submit' className='bg-submit_blue  px-8 py-4 my-2 rounded-xl   text-white'>Sign In</Button>
                </div>
            </form>
         </div>
      </div>
    )
};
export default SignIn;