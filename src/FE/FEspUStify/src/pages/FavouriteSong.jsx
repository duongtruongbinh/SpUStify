import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetFavouriteSongsQuery } from '../redux/services/CoreApi';

const FavorutieSong = () => {

//  const [country, setCountry] = useState('');
//  const [loading, setLoading] = useState(true);
  // const { activeSong, isPlaying } = useSelector((state) => state.player);
  try {
    const { data, isFetching, error } =  useGetFavouriteSongsQuery();

    // useEffect(() => {
    //   axios
    //     .get(`https://geo.ipify.org/api/v2/country?apiKey=${import.meta.env.VITE_GEO_API_KEY}`)
    //     .then((res) => setCountry(res?.data?.location.country))
    //     .catch((err) => console.log(err))
    //     .finally(() => setLoading(false));
    // }, [country]);
  
    if (isFetching && loading) return <Loader title='Loading songs around you' />;
  
    if (error && country) return <Error />;
    if(data) {
      console.log(data)
    }
  }catch(error){
    console.log(error)
  }
   

  return (
    <div className='flex flex-col'>
      <h2 className='text-xl text-gray-100 text-left mt-4 mb-10'>
        Around You, <span className='font-black'>hello</span>
      </h2>

      {/* <div className='flex flex-wrap sm:justify-start justify-center gap-8'>
        {data?.map((song, index) => (
          <SongCard
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            index={index}
          />
        ))}
      </div> */}
    </div>
  );
};

export default FavorutieSong;
