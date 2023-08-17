import { Button } from "@material-tailwind/react";
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useRegisterUser} from '../redux/services/CoreApi';
const SignUp = () => {
   
    const handleRegister = async () => {
        const userData = {
          username: 'trinhh123',
          password: '123456789',
          email: 'example@email.com',
          isArtist: false
        };
      
        const  { data, isLoading, error } = await useRegisterUser(userData).unwrap(); // Gọi API đăng ký và unwrap kết quả
        if (isLoading) return <Loader title='Loading top charts' />;
       
          if (error) return <Error />;
          if (data) {
            // Xử lý dữ liệu
            console.log(data);
          } 
      };
    return (
        <>
        <Button onClick={handleRegister}>Sign Up</Button>
        </>
    )
};
export default SignUp;