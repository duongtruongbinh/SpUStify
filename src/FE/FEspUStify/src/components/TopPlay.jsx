import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';

import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { useGetTopChartsQuery } from '../redux/services/CoreApi';

import 'swiper/css';
import 'swiper/css/free-mode';

const TopChartCard = ({ song, index, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => (
  <div className='w-full flex flex-row items-center hover:bg-gray-400/50 py-2 p-4 rounded-2xl cursor-pointer mb-2'>
    <h3 className='font-bold text-base text-gray-100 mr-3'>
      {index + 1}.
    </h3>
    <div className='flex-1 flex flex-row justify-between items-center'>
      <img 
        src={song?.images?.coverart} 
        alt={song?.title} 
        className='w-20 h-20 rounded-2xl'
      />
      <div className='flex-1 flex flex-col justify-center mx-3'>
        <Link to={`/songs/${song.key}`}>
          <p className='text-gray-100 text-sm'>
            {song?.title}
          </p>
        </Link>
        <Link to={`/artists/${song?.artists[0].adamid}`}>
          <p className='text-gray-400 text-xs mt-1'>
            {song?.subtitle}
          </p>
        </Link>
      </div>
    </div>
    <PlayPause
      isPlaying={isPlaying}
      activeSong={activeSong}
      song={song}
      handlePause={handlePauseClick}
      handlePlay={handlePlayClick}
    />
  </div>
)

const TopPlay = () => {

  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const  {data } = useGetTopChartsQuery();
  console.log(data)
  const likes = data['Leaderboard by likes'];
  console.log(likes)

  const divRef = useRef(null);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  //const leaderboardByLikes = data["Leaderboard by likes"];
// trả về một phần của mảng
  const topPlays = data['Leaderboard by likes']?.slice(0, 5);
 

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, index) => {
    dispatch(setActiveSong({ song, data, index }));
    dispatch(playPause(true));
  };

  return (
    <div ref={divRef} className='xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[300px] max-w-full flex flex-col'>
      <div className='w-full flex flex-col'>
        <div className='flex flex-row justify-between items-center'>
          <h2 className='text-gray-100 text-xl'>Top Charts</h2>
          <Link to='/top-charts'>
            <p className='text-gray-300 text-xs cursor-pointer'>See more</p>
          </Link>
        </div>

        <div className='mt-4 flex flex-col gap-1'>
          {topPlays?.map((song, index) => (
            <TopChartCard
              key={song.id}
              song={song}
              index={index}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePauseClick={handlePauseClick}
              handlePlayClick={() => handlePlayClick(song, index)}
            />
          ))}
        </div>
      </div>

      <div className='w-full flex flex-col mt-8 mb-10'>
        <div className='flex flex-row justify-between items-center'>
          <h2 className='text-gray-100 text-xl'>Top Artists</h2>
          <Link to='/top-artists'>
            <p className='text-gray-300 text-xs cursor-pointer'>See more</p>
          </Link>
        </div>

        <Swiper
          slidesPerView='auto'
          spaceBetween={15}
          freeMode
          centeredSlides
          centeredSlidesBounds
          modules={[FreeMode]}
          className='mt-4'
        >
          {topPlays?.map((song, index) => (
            <SwiperSlide
              key={song?.id}
              style={{ width: '25%', height: 'auto' }}
              className='shadow-lg rounded-full animate-slideright'
            >
              <Link to={`/artists/${song?.song_artists[0]}`}>
                <img 
                  src={song?.avatar} 
                  alt='name'
                  className='rounded-full w-full object-cover'
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </div>
  )
};

export default TopPlay;
