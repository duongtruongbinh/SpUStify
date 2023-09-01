import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { selectUser } from "../assets";
import Na from "../assets/Na.jpeg";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Button } from "@material-tailwind/react";

const Searchbar = () => {
const {username} = useSelector((state) => state.player);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    //chuyển sang trang chứa kết quả search
    navigate(`/search/${searchTerm}`);
  };
  const handleSignIn = () => {
    navigate('/signin');
  }
  const handleSignUp = () => {
    navigate('/signup');
  }

  return (
    <div className="flex items-center pl-6 pr-6 pt-4 pb-4 gap-4 bg-[#18181A]">
      <div className="flex items-center gap-6 flex-1  rounded-[20px] bg-[#2A2A2A]">
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className=" text-gray-400 focus-within:text-gray-600">
          <label htmlFor="search-field" className="sr-only">
            Search all songs
          </label>

          <div className="flex flex-row justify-start items-center">
            <FiSearch className="w-4 h-5 ml-4 text-gray-100" />
            <input
              name="search-field"
              autoComplete="off"
              id="search-field"
              placeholder="Search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none placeholder-white text-sm text-gray-100 p-3"
            />
          </div>
        </form>
      </div>
{
  username === 'Admin' && 
  <div className=" flex flex-row gap-1">
    <Button onClick={handleSignIn} className="border border-blue-500 bg-blue-500 py-2 ">Sign in</Button>
    <Button onClick={handleSignUp} className="border border-blue-500 bg-blue-500 py-2  ">Sign up</Button>
    </div>
}
{
  username !== 'Admin' &&  <div className="w-[180px] relative flex pt-1 pb-1 pl-2 pr-4 items-center gap-2 rounded-[20px] bg-[#2A2A2A]">
  <img
    src={Na}
    className="ml-1 mt-1 mb-1 w-[25px] h-[25px] object-cover rounded-2xl  bg-lightgray bg-center bg-cover bg-no-repeat"
  />
  <div className="relative w-[100px] overflow-hidden">
    <p
      className="items-center animate-marquee text-gray-100"
      id="truncate-text">
      {username}
    </p>
  </div>

  <img className="absolute right-4" src={selectUser} />
</div>
}
     
    </div>
  );
};

export default Searchbar;
