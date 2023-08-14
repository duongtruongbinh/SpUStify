// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const shazamCoreApi = createApi({
//   reducerPath: 'DatabaseApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'http://127.0.0.1:8000/api/',
//     prepareHeaders: (headers) => {
//       headers.set('X-RapidAPI-Key', import.meta.env.VITE_SHAZAM_CORE_RAPID_API_KEY); 
      
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     getTopCharts: builder.query({ query: () => 'v1/charts/world' }),
//     getSongsByGenre: builder.query({ query: (genre) => `v1/charts/genre-world?genre_code=${genre}` }),
//     getSongDetails: builder.query({ query: ({ songid }) => `v1/tracks/details?track_id=${songid}` }),
//     getSongRelated: builder.query({ query: ({ songid }) => `v1/tracks/related?track_id=${songid}` }),
//     getArtistDetails: builder.query({ query: ({ artistId }) => `v2/artists/details?artist_id=${artistId}` }), 
//     getSongsByCountry: builder.query({ query: (countryCode) => `v1/charts/country?country_code=${countryCode}` }), 
//     getSongsBySearch: builder.query({ query: (searchTerm) => `v1/search/multi?search_type=SONGS_ARTISTS&query=${searchTerm}` }),  }),
// });

// export const {
//   useGetTopChartsQuery,
//   useGetSongsByGenreQuery,
//   useGetSongDetailsQuery,
//   useGetSongRelatedQuery,
//   useGetArtistDetailsQuery,
//   useGetSongsByCountryQuery,
//   useGetSongsBySearchQuery,
// } = shazamCoreApi;
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
      return headers;
    },
  }),
  // query là get
  //mutation là post
  //các Actions
  endpoints: (builder) => ({
    getTopCharts: builder.query({ query: () => 'home/leaderboard/' }), // Adjust endpoint path
    getSongsByGenre: builder.query({ query: (genre) => 'home/songs/' }), // Adjust endpoint path
    getSongRecommend: builder.query({ query: () => 'home/recommend/' }),
    getSongDetails: builder.query({ query: ({ songid }) => `home/songs/${songid}` }), // Adjust endpoint path
    getSongRelated: builder.query({ query: ({ songid }) => `home/songs/${songid}/related` }), // Adjust endpoint path
    getArtistDetails: builder.query({ query: ({ artistId }) => `v2/artists/details?artist_id=${artistId}` }), // Adjust endpoint path
    getSongsByCountry: builder.query({ query: (countryCode) => `home/songs?country_code=${countryCode}` }), // Adjust endpoint path
    getSongsBySearch: builder.query({ query: (searchTerm) => `home/songs?search_type=SONGS_ARTISTS&query=${searchTerm}` }), // Adjust endpoint path
    getHome: builder.query({ query: () => 'home/' }),
    registerUser: builder.mutation({ query: (userData) => ({ url: 'register/', method: 'POST',  body: {
      username: userData.username,
      password: userData.password,
      email: userData.email,
      isArtist: userData.email
    },
      })}),
      login:builder.mutation({query: (userData) => (
        {
          url: 'login/',
          method: 'POST',
          body: {
            username: userData.username,
            password: userData.password
          }
        }
      )})
    })
});

export const {
  useGetTopChartsQuery, // gọi useGetTopChartQuery thì nó sẽ gọi endpoint get home/song
  useGetSongsByGenreQuery,
  useGetSongRecommendQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
  useGetArtistDetailsQuery,
  useGetSongsByCountryQuery,
  useGetSongsBySearchQuery,
  useGetHomeQuery,
  useRegisterUser,
  useLogin
} = CoreApi;
