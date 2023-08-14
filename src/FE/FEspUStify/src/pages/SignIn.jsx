import { Button } from "@material-tailwind/react";
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useRegisterUser} from '../redux/services/CoreApi';
const SignIn = () => {
    const { data, isLoading, error } = useRegisterUser();
    if (isLoading) return <Loader title='Sending' />;
    if (error) return <Error />;
    const handleLogin = async () => {
        const userData = {
          username: 'trinhh123',
          password: '123456789',
          
        };
      
        const  { data, error } = await useRegisterUser(userData).unwrap(); // Gọi API đăng ký và unwrap kết quả
        if (data) {
            // Xử lý dữ liệu
            console.log(data);
          } else if (error) {
            // Xử lý lỗi
            console.error(error);
          } // Xử lý kết quả trả về từ API
      };
    return (
        <>
        <Button onClick={handleRegister}>Sign Up</Button>
        </>
    )
};
export default SignIn;