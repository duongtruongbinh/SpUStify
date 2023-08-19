import { Button } from "@material-tailwind/react";
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useLoginMutation} from '../redux/services/CoreApi';
const SignIn = () => {
  const [login, { isLoading, error, data }] = useLoginMutation();
    const handleLogin =  () => {
        const userData = {
          username: 'trinh',
          password: '123456789',
          
        };
        login(userData);
        
         // Gọi API đăng ký và unwrap kết quả
        
        if (isLoading) return <Loader title='Sending' />;
        if (error) return <Error />;
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
        <Button onClick={handleLogin}>Sign Up</Button>
        </>
    )
};
export default SignIn;