import { HiOutlineHashtag, HiOutlineHome, HiOutlinePhotograph, HiOutlineUserGroup, HiUpload } from 'react-icons/hi';
import {MdOutlinePlaylistAdd} from 'react-icons/md';

export const genres = [
  { title: 'Pop', value: 'POP' },
  { title: 'Hip-Hop', value: 'HIP_HOP_RAP' },
  { title: 'Dance', value: 'DANCE' },
  { title: 'Electronic', value: 'ELECTRONIC' },
  { title: 'Soul', value: 'SOUL_RNB' },
  { title: 'Alternative', value: 'ALTERNATIVE' },
  { title: 'Rock', value: 'ROCK' },
  { title: 'Latin', value: 'LATIN' },
  { title: 'Film', value: 'FILM_TV' },
  { title: 'Country', value: 'COUNTRY' },
  { title: 'Worldwide', value: 'WORLDWIDE' },
  { title: 'Reggae', value: 'REGGAE_DANCE_HALL' },
  { title: 'House', value: 'HOUSE' },
  { title: 'K-Pop', value: 'K_POP' },
];

export const links = [
  { name: 'HomePage', to: '/', icon: HiOutlineHome },
  { name: 'Favourite Song', to: '/favourite-song', icon: HiOutlinePhotograph },
  { name: 'Top Artists', to: '/top-artists', icon: HiOutlineUserGroup },
  { name: 'Leaderboard', to: '/top-charts', icon: HiOutlineHashtag },
  { name: 'Upload Song', to: '/upload-song', icon: HiUpload } ,
  {name: 'Create Playlist', to: '/create-playlist',icon: MdOutlinePlaylistAdd}
];
