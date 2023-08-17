import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { ButtonNext, ButtonPrev,Error, Loader, SongCard, BannerCard, PlaylistCard } from '../components';
import { genres } from '../assets/constants';
import { selectGenreListId } from '../redux/features/playerSlice';
import { useGetHomeQuery} from '../redux/services/CoreApi';
import { useGetTopChartsQuery } from '../redux/services/CoreApi';

const HomePage = () => {

  //const itemsPerPage = 4;
  const [currentItem, setCurrentItem] = useState(4);
  const [startIndexSong, setStartIndexSong] = useState(0);
  const [endIndexSong, setEndIndexSong] = useState(4);
  const [startIndexPlaylist, setStartIndexPlaylist] = useState(0);
  const [endIndexPlaylist, setEndIndexPlaylist] = useState(4);

  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetHomeQuery();
 

  if (isFetching) return <Loader title='Loading songs...' />;

  if (error) return <Error />;
  
  const ListPlaylist = data['List_of_playlists'];

  const ListSong =  data['List_of_songs'];
  
  const dataSong = Array.isArray(ListSong) ? ListSong : [ListSong];
  const dataPlaylist = Array.isArray(ListPlaylist) ? ListPlaylist : [ListPlaylist];
  // const genreTitle = genres.find(({ value }) => value === genreListId)?.title;

  const handleNextPageSong = () => {
    setStartIndexSong((start) => endIndexSong + 1 <  dataSong.leng? start + 1: start );
    setEndIndexSong((end)=> endIndexSong + 1 < dataSong? end + 1: end);

  };

  const handlePreviousPageSong = () => {
    setStartIndexSong((start) => startIndexSong - 1 > 0? start - 1: start);
    setEndIndexSong((end)=> startIndexSong - 1 > 0?  end - 1: end);

  };
  const handleNextPagePlaylist = () => {
    setStartIndexPlaylist((start) => endIndexPlaylist + 1 <  dataPlaylist.leng? start + 1: start);
    setEndIndexPlaylist((end)=> endIndexPlaylist + 1 <  dataPlaylist.leng? end + 1: end);

  };

  const handlePreviousPagePlaylist = () => {
    setStartIndexPlaylist((start) => startIndexPlaylist - 1 > 0? start - 1: start);
    setEndIndexPlaylist((end)=> startIndexPlaylist -1 > 0 ? end - 1: end);

  };


  const visibleDataSong = dataSong.slice(startIndexSong, endIndexSong);
  
  const visibleDataPlaylist = dataPlaylist.slice(startIndexPlaylist, endIndexPlaylist);
  




  const hasPreviousPageSong = startIndexSong > 0;
  const hasNextPageSong = endIndexSong < dataSong.length ;
  const hasPreviousPagePlaylist = startIndexPlaylist > 0;
  const hasNextPagePlaylist =  endIndexPlaylist < dataPlaylist.length;


  return (
    <div className='flex flex-col'>
      <div className='w-full flex justify-between items-center sm:flex-row flex-col mt-2 mb-10'>
        <h2 className='text-xl mt-2 text-gray-100 text-left'>
          Welcome to SpUStify
          {/* {genreTitle} */}
        </h2>
        {/* <select
          //  onChange={(e) => dispatch(selectGenreListId(e.target.value))}
          // value={genreListId || 'pop'}
          className='bg-white/10 backdrop-blur-sm text-gray-100 p-2 text-xs rounded-2xl outline-none sm:mt-0 mt-5'
        >
          {genres.map((genre) =>
            <option 
              key={genre.value} 
              value={genre.value}
            >
              {genre.title}
            </option>
          )}

        </select> */}
      </div>
<div className="flex flex-col items-center gap-9" >
<h2 className='text-white '>Recommend Songs</h2>
{/* <Link to=''>
</Link> */}
<div className='absolute ml-0'>
  {
    hasPreviousPageSong && (
<ButtonPrev  />
    )
  }
  </div>
<div className='flex flex-wrap sm:justify-start justify-center gap-8'>


{/* <BannerCard /> */}



{ visibleDataSong?.map((song, index) => (
  <SongCard 
    key={song.id}
    song={song}
    isPlaying={isPlaying}
    activeSong={activeSong}
    data={data}
    index={index}
  />
)
)}
</div  >
<div>
{
  hasNextPageSong && (
<ButtonNext onClick = {handleNextPageSong}/>
  )
}
</div>




<h2 className='text-white ml-0'>Recommend Playlists</h2>
<div className='flex flex-wrap sm:justify-start justify-center gap-8'>


{/* <BannerCard /> */}


{visibleDataPlaylist?.map((song, index) => (
  <PlaylistCard
    key={song.id}
    song={song}
    isPlaying={isPlaying}
    activeSong={activeSong}
    data={data}
    index={index}
  />
)
)}
</div>

</div>

      
    </div>
  );
};

export default HomePage;