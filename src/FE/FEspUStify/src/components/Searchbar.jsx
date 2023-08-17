import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { selectUser } from '../assets';
import Na from '../assets/Na.jpeg';

const Searchbar = () => {


  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate(`/search/${searchTerm}`);
  };
 

  return (
    <div className='flex items-center pl-6 pr-6 pt-4 pb-4 gap-4'>
      <div className="flex items-center gap-6 flex-1  rounded-[20px] bg-gray-800">
      <form
      onSubmit={handleSubmit}
      autoComplete='off'
      className=' text-gray-400 focus-within:text-gray-600'
    >
      <label
        htmlFor='search-field'
        className='sr-only'
      >
        Search all songs
      </label>

      <div className='flex flex-row justify-start items-center'>
        <FiSearch className='w-4 h-5 ml-4 text-gray-100' />
        <input
          name='search-field'
          autoComplete='off'
          id='search-field'
          placeholder='Search'
          type='search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='flex-1 bg-transparent border-none outline-none placeholder-white text-sm text-gray-100 p-3'
        />
      </div>
    </form>
</div>

    <div className='w-[180px] relative flex pt-1 pb-1 pl-2 pr-4 items-center gap-2 rounded-[20px] bg-gray-800'>
  

    <img src={Na} 
    className='ml-1 mt-1 mb-1 w-[25px] h-[25px] object-cover rounded-2xl  bg-lightgray bg-center bg-cover bg-no-repeat'
    />
<div className='relative w-[100px] overflow-hidden'>
  <p className="items-center animate-marquee" id="truncate-text">
    Trinh
  </p>
</div>


<img className='absolute right-4' src={selectUser} />
    </div>
    </div>
    
  );
};

export default Searchbar;