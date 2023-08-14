import { useDispatch, useSelector } from 'react-redux';

import { Error, Loader, SongCard, BannerCard, PlaylistCard } from '../components';
import { genres } from '../assets/constants';
import { selectGenreListId } from '../redux/features/playerSlice';
import { useGetHomeQuery} from '../redux/services/CoreApi';


const HomePage = () => {

  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetHomeQuery();

  if (isFetching) return <Loader title='Loading songs...' />;

  if (error) return <Error />;
  console.log(data['List of playlists'])
  const ListSong = data['List of songs'];
  const ListPlaylist =  data['List of playlists'];
  const dataSong = Array.isArray(ListSong) ? ListSong : [ListSong];
  const dataPlaylist = Array.isArray(ListPlaylist) ? ListPlaylist : [ListPlaylist];
  // const genreTitle = genres.find(({ value }) => value === genreListId)?.title;

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
 <div className='flex flex-wrap sm:justify-start justify-center gap-8'>


{/* <BannerCard /> */}



{dataSong?.map((song, index) => (
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
</div>
<h2 className='text-white ml-0'>Recommend Playlists</h2>
<div className='flex flex-wrap sm:justify-start justify-center gap-8'>


{/* <BannerCard /> */}


{dataPlaylist?.map((song, index) => (
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