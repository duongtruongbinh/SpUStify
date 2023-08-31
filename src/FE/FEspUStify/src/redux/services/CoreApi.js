
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const CoreApi = createApi({
  // DatabaseApi là store: nơi lưu trữ state
  reducerPath: 'DatabaseApi',
  //baseQuery: là 1 hàm để thực hiện các cuộc gọi api cơ bản
  // hàm để call api từ BE
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/', // Adjust the base URL for your local API
    prepareHeaders: (headers) => {
      // No need for the X-RapidAPI-Key header for local development
      const token = btoa('h3:Acccuah3'); // Encode the username and password
      headers.set('Authorization', `Basic ${token}`);
      return headers;
    },

    credentials: "same-origin"
  }),

  // query là get
  //mutation là post
  //các Actions
  endpoints: (builder) => ({
    getTopCharts: builder.query({ query: () => 'home/leaderboard/' }), // Adjust endpoint path
    getSongs: builder.query({ query: (genre) => 'songs/' }), // Adjust endpoint path
    getSongRecommend: builder.query({ query: () => 'home/recommend/' }),
    getSongDetails: builder.query({ query: ({ songid }) => `songs/${songid}` }), // Adjust endpoint path
    getPlaylists: builder.query({ query: () => 'playlists/' }), // Adjust endpoint path
    getArtistDetails: builder.query({ query: ({ artistId }) => `v2/artists/details?artist_id=${artistId}` }), // Adjust endpoint path
    getFavouriteSongs: builder.query({ query: () => 'home/favourite/' }),
    getSongsBySearch: builder.query({ query: (searchTerm) => `home/songs?search_type=SONGS_ARTISTS&query=${searchTerm}` }), // Adjust endpoint path
    getHome: builder.query({ query: () => 'home/' }),
    playSong: builder.mutation({ query: (songID) => ({ url: `songs/${songID}/play/`, method: 'POST' }) }),
    likeSong: builder.mutation({ query: (songID) => ({ url: `songs/${songID}/like/`, method: 'POST' }) }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: 'register/', method: 'POST', body: {
          username: userData.username,
          password: userData.password, email: userData.email, isArtist: userData.email
        },
      })
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: 'login/', method: 'POST', body: {
          username: userData.username, password: userData.password
        }
      }
      )
    }),
    createPlaylist: builder.mutation({
      query: (FormData) => ({
        url: 'playlist/create', method: 'POST', body: {
          FormData
        },
      }
      )
    })
  })
});



export const {
  useGetTopChartsQuery, // gọi useGetTopChartQuery thì nó sẽ gọi endpoint get home/song
  useGetSongsQuery,
  useGetSongRecommendQuery,
  useGetSongDetailsQuery,
  useGetPlaylistsQuery,
  useGetArtistDetailsQuery,
  useGetFavouriteSongsQuery,
  useGetSongsBySearchQuery,
  useGetHomeQuery,
  usePlaySongMutation,
  useLikeSongMutation,
  useRegisterUserMutation,
  useLoginMutation,
  useCreatePlaylistMutation,
} = CoreApi;
