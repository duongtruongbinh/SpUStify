import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const Api = () => { };

debugger;
export const CoreApi = createApi({
  // DatabaseApi là store: nơi lưu trữ state
  reducerPath: "DatabaseApi",
  //baseQuery: là 1 hàm để thực hiện các cuộc gọi api cơ bản
  // hàm để call api từ BE

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/", // Adjust the base URL for your local API
    prepareHeaders: (headers) => {
      // No need for the X-RapidAPI-Key header for local development

      // const token = btoa('Admin:Acccuaadmin'); // Encode the username and password
      // headers.set('Authorization', `Basic ${token}`);

      return headers;
    },

    credentials: "same-origin",
  }),

  // query là get
  //mutation là post
  //các Actions

  endpoints: (builder) => ({
    getTopCharts: builder.query({
      query: () => "home/leaderboard/",
    }), // Adjust endpoint path
    getSongs: builder.query({
      query: (genre) => "songs/",
    }), // Adjust endpoint path
    getSongRecommend: builder.query({
      query: () => "home/recommend/",
    }),

    getSongDetails: builder.query({
      query: ({ songid }) => `songs/${songid}`,
    }), // Adjust endpoint path
    getPlaylists: builder.query({
      query: () => "playlists/",
    }), // Adjust endpoint path

    getPlaylistDetails: builder.query({
      query: ({ playlistid }) => `playlists/${playlistid}`,
    }), // Adjust endpoint path
    getArtistDetails: builder.query({
      query: ({ artistId }) => `artists/${artistId}`,
    }), // Adjust endpoint path
    getFavouriteSongs: builder.query({
      query: () => "favourite/",
    }),

    getHome: builder.query({
      query: () => "home/",
    }),
    getSongsBySearch: builder.query({
      query: (searchTerm) => `songs/?query=${searchTerm}`,
    }),
    getAllBySearch: builder.query({
      query: (searchTerm) => `home/?query=${searchTerm}`,
    }),
    playSong: builder.mutation({
      query: (songID) => ({
        url: `songs/${songID}/play/`,
        method: "POST",
      }),
    }),

    registerUser: builder.mutation({
      query: (userData) => ({
        url: "register/",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: "login/",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const {
  useGetTopChartsQuery, // gọi useGetTopChartQuery thì nó sẽ gọi endpoint get home/song
  useGetSongsQuery,
  useGetSongRecommendQuery,
  useGetSongDetailsQuery,
  useGetPlaylistsQuery,
  useGetPlaylistDetailsQuery,
  useGetArtistDetailsQuery,
  useGetFavouriteSongsQuery,
  useGetHomeQuery,
  useGetSongsBySearchQuery,
  useGetAllBySearchQuery,
  usePlaySongMutation,
  useRegisterUserMutation,
  useLoginMutation,
} = CoreApi;
