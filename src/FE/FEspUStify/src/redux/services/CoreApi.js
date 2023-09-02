
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Api = () => {

}

debugger
export const CoreApi = createApi({

  // DatabaseApi là store: nơi lưu trữ state
  reducerPath: 'DatabaseApi',
  //baseQuery: là 1 hàm để thực hiện các cuộc gọi api cơ bản
  // hàm để call api từ BE

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/', // Adjust the base URL for your local API
    prepareHeaders: (headers) => {
      // No need for the X-RapidAPI-Key header for local development

      // const token = btoa('Admin:Acccuaadmin'); // Encode the username and password
      // headers.set('Authorization', `Basic ${token}`);


      return headers;
    },

    credentials: "same-origin"
  }),

  // query là get
  //mutation là post
  //các Actions

  endpoints: (builder) => ({
    getTopCharts: builder.query({
      query: () => 'home/leaderboard/',
      async onQueryStarted(request, api, context) {
        if (!isLoginOrRegisterEndpoint(request.endpoint)) {
          const { username, password } = useSelector((state) => state.player);

          request.headers.set('Authorization', createAuthorizationHeader(username, password));
        }
      },
    }), // Adjust endpoint path
    getSongs: builder.query({
      query: (genre) => 'songs/',
      async onQueryStarted(request, api, context) {
        if (!isLoginOrRegisterEndpoint(request.endpoint)) {
          const { username, password } = useSelector((state) => state.player);

          request.headers.set('Authorization', createAuthorizationHeader(username, password));
        }
      },

    }), // Adjust endpoint path
    getSongRecommend: builder.query({
      query: () => 'home/recommend/',
      async onQueryStarted(request, api, context) {
        if (!isLoginOrRegisterEndpoint(request.endpoint)) {
          const { username, password } = useSelector((state) => state.player);

          request.headers.set('Authorization', createAuthorizationHeader(username, password));
        }
      },
    }),
    getSongDetails: builder.query({
      query: ({ songid }) => `songs/${songid}`,
      async onQueryStarted(request, api, context) {
        if (!isLoginOrRegisterEndpoint(request.endpoint)) {
          const { username, password } = useSelector((state) => state.player);

          request.headers.set('Authorization', createAuthorizationHeader(username, password));
        }
      },

    }), // Adjust endpoint path
    getPlaylists: builder.query({
      query: () => 'playlists/',
      async onQueryStarted(request, api, context) {
        if (!isLoginOrRegisterEndpoint(request.endpoint)) {
          const { username, password } = useSelector((state) => state.player);

          request.headers.set('Authorization', createAuthorizationHeader(username, password));
        }
      },
    }), // Adjust endpoint path
    getPlaylistDetails :  builder.query({
      query: ({playlistid}) =>  `playlists/${playlistid}`,
      async onQueryStarted(request, api, context) {
        if (!isLoginOrRegisterEndpoint(request.endpoint)) {
          const { username, password } = useSelector((state) => state.player);

          request.headers.set('Authorization', createAuthorizationHeader(username, password));
        }
      },
    }), // Adjust endpoint path
    getArtistDetails: builder.query({
      query: ({ artistId }) => `v2/artists/details?artist_id=${artistId}`,
      async onQueryStarted(request, api, context) {
        if (!isLoginOrRegisterEndpoint(request.endpoint)) {
          const { username, password } = useSelector((state) => state.player);

          request.headers.set('Authorization', createAuthorizationHeader(username, password));
        }
      },

    }), // Adjust endpoint path
    getFavouriteSongs: builder.query({
      query: () => 'home/favourite/',

      async onQueryStarted(request, api, context) {
        if (!isLoginOrRegisterEndpoint(request.endpoint)) {
          const { username, password } = useSelector((state) => state.player);

          request.headers.set('Authorization', createAuthorizationHeader(username, password));
        }
      },
    }),

    getHome: builder.query({
      query: () => 'home/',
      async onQueryStarted(request, api, context) {
        if (!isLoginOrRegisterEndpoint(request.endpoint)) {
          const { username, password } = useSelector((state) => state.player);

          request.headers.set('Authorization', createAuthorizationHeader(username, password));
        }
      },

    }),

    getSongsBySearch: builder.query({
      query: (searchTerm) => `songs/?query=${searchTerm}`,
      async onQueryStarted(request, api, context) {
        if (!isLoginOrRegisterEndpoint(request.endpoint)) {
          const { username, password } = useSelector((state) => state.player);

          request.headers.set('Authorization', createAuthorizationHeader(username, password));
        }
      },

    }),
    getAllBySearch: builder.query({
      query: (searchTerm) => `home/?query=${searchTerm}`,

      async onQueryStarted(request, api, context) {
        if (!isLoginOrRegisterEndpoint(request.endpoint)) {
          const { username, password } = useSelector((state) => state.player);

          request.headers.set('Authorization', createAuthorizationHeader(username, password));
        }
      },
    }),
    playSong: builder.mutation({
      query: (songID) => ({
        url: `songs/${songID}/play/`, method: 'POST',
        async onQueryStarted(request, api, context) {
          if (!isLoginOrRegisterEndpoint(request.endpoint)) {
            const { username, password } = useSelector((state) => state.player);

            request.headers.set('Authorization', createAuthorizationHeader(username, password));
          }
        },


      })
    }),
    likeSong: builder.mutation({
      query: (songID) => ({
        url: `songs/${songID}/like/`, method: 'POST',
        async onQueryStarted(request, api, context) {
          if (!isLoginOrRegisterEndpoint(request.endpoint)) {
            const { username, password } = useSelector((state) => state.player);

            request.headers.set('Authorization', createAuthorizationHeader(username, password));
          }
        },

      })
    }),
    addSongToPlaylist: builder.mutation({
      query: ({songid,FormData}) => ({
        url: `/songs/${songid}/add-to-playlist/`, method: 'POST', body:
          FormData

        ,
        async onQueryStarted(request, api, context) {
          if (!isLoginOrRegisterEndpoint(request.endpoint)) {
            const { username, password } = useSelector((state) => state.player);

            request.headers.set('Authorization', createAuthorizationHeader(username, password));
          }
        },


      })
    }),
    createSong: builder.mutation({
      query: (FormData) => ({
        url: 'songs/create', method: 'POST', body:
          FormData

        ,
        async onQueryStarted(request, api, context) {
          if (!isLoginOrRegisterEndpoint(request.endpoint)) {
            const { username, password } = useSelector((state) => state.player);

            request.headers.set('Authorization', createAuthorizationHeader(username, password));
          }
        },


      })
    }),

    createPlaylist: builder.mutation({
      query: (FormData) => ({
        url: 'playlists/create', method: 'POST', body:
          FormData

        ,
        async onQueryStarted(request, api, context) {
          if (!isLoginOrRegisterEndpoint(request.endpoint)) {
            const { username, password } = useSelector((state) => state.player);

            request.headers.set('Authorization', createAuthorizationHeader(username, password));
          }
        },


      })
    }),
    editPlaylist: builder.mutation({
      query: ({playlistid,FormData}) => ({
        url: `playlists/${playlistid}/edit/`, method: 'PUT', body:
          FormData

        ,
        async onQueryStarted(request, api, context) {
          if (!isLoginOrRegisterEndpoint(request.endpoint)) {
            const { username, password } = useSelector((state) => state.player);

            request.headers.set('Authorization', createAuthorizationHeader(username, password));
          }
        },


      })
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: 'register/', method: 'POST', body: userData
      })
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: 'login/', method: 'POST', body: {
          username: userData.username, password: userData.password
        },

      }
      )
    })
  })
});
debugger
// Helper function to check if an endpoint is 'login' or 'register'
function isLoginOrRegisterEndpoint(endpoint) {
  return endpoint.queryKey === 'register';
  // endpoint.queryKey === 'login' || 
}

// Helper function to create the Authorization header
function createAuthorizationHeader(username, password) {

  const token = btoa(`${username}:${password}`);
  return `Basic ${token}`;
}



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
  useAddSongToPlaylistMutation,
  useGetSongsBySearchQuery,
  useGetAllBySearchQuery,
  usePlaySongMutation,
  useLikeSongMutation,
  useCreateSongMutation,
  useEditPlaylistMutation,
  useRegisterUserMutation,
  useLoginMutation,
  useCreatePlaylistMutation,
} = CoreApi;
