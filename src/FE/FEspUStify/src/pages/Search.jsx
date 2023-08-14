import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Error, Loader, SongCard } from '../components';
import { useGetSongsBySearchQuery } from '../redux/services/CoreApi';

const Search = () => {

  const { searchTerm } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetSongsBySearchQuery(searchTerm);

  const songs = data?.tracks?.hits.map((song) => song.track);

  if (isFetching) return <Loader title='Loading top charts' />;

  if (error) return <Error />;

  return (
    <div className='flex flex-col'>
      <h2 className='text-xl text-gray-100 text-left mt-4 mb-10'>
        Showing results for <span className='font-white'>{searchTerm}</span>
      </h2>

      <div className='flex flex-wrap sm:justify-start justify-center gap-8'>
        {songs?.map((song, index) => (
          <SongCard
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
