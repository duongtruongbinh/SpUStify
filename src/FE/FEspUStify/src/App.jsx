import { useSelector, useDispatch } from 'react-redux';
import {useLocation, BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import { setLikeSongId } from './redux/features/playerSlice';
import { Searchbar, Sidebar, MusicPlayer, TopPlay, Loader, Error } from './components';
import { SignIn, SignUp,ArtistDetails, TopArtists, FavouriteSong, HomePage, Search, SongDetails, TopCharts } from './pages';
import { useGetFavouriteSongsQuery } from './redux/services/CoreApi';



const App = () => {
  
  const { activeSong } = useSelector((state) => state.player);


  
 
 
    
   
  


  
  
 


  const location = useLocation();
  const currentRoute = location.pathname;
 
  return (
    <div className="relative flex">
      {
         currentRoute != '/signin' &&(  <Sidebar />)
      }
     
      
      <div className="flex-1 flex flex-col">
      {
         currentRoute != '/signin' &&(  <Searchbar />)
      }
        

        <div className="px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
          <div className="flex-1 h-fit pb-40">
           
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/top-artists" element={<TopArtists />} />
                <Route  path="/top-charts" index element={<TopCharts />} />
                <Route path="/favourite-song" element={<FavouriteSong />} />
                <Route path="/artists/:id" element={<ArtistDetails />} />
                <Route path="/songs/:songid" element={<SongDetails />} />
                <Route path="/search/:searchTerm" element={<Search />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
              </Routes>
           
          </div>
          <div className="xl:sticky relative top-0 h-fit">
            {
              currentRoute != '/top-charts' &&  currentRoute != '/signin'   && ( <TopPlay />)
            }
           
            
          </div>
        </div>
      </div>

      {activeSong?.name && (
        <div className="absolute h-28 bottom-0 left-0 right-0 flex animate-slideup bg-white/5 backdrop-blur-lg rounded-t-3xl z-10">
          <MusicPlayer />
        </div>
      )}
    </div>
  );
};

export default App;
