import { createSlice } from '@reduxjs/toolkit';
import { useState } from 'react';
debugger
const initialState = {
  currentSongs: [],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  activeSong: {},
  genreListId: '',
  likedSongsId: [],
  username: null,
  password: null,
  isArtist: false,
  isLogin: false,
};



const playerSlice = createSlice({
  name: 'player',
  initialState,

  reducers: {
    setActiveSong: (state, action) => {
      state.activeSong = action.payload.song;


      state.currentSongs = action.payload.data;




      state.currentIndex = action.payload.index;
      state.isActive = true;
    },

    nextSong: (state, action) => {

      state.activeSong = state.currentSongs[action.payload];

      console.log("check action playload")
      console.log(action.payload)



      state.currentIndex = action.payload;
      state.isActive = true;
    },

    prevSong: (state, action) => {

      state.activeSong = state.currentSongs[action.payload];


      state.currentIndex = action.payload;
      state.isActive = true;
    },

    playPause: (state, action) => {
      state.isPlaying = action.payload;
    },

    selectGenreListId: (state, action) => {
      state.genreListId = action.payload;
    },

    setLikeSongId: (state, action) => {

      state.likedSongsId = [...state.likedSongsId, action.payload];
    },
    setRemoveSong: (state, action) => {
      state.likedSongsId = state.likedSongsId.filter(song => song !== action.payload);
    },
    setRegisterLogin: (state, action) => {
      state.username = action.payload.username,
        state.password = action.payload.password,
        state.isArtist = action.payload.isArtist,
        state.isLogin = true
    },
    setLogout: (state) => {
      state.username = null,
        state.password = null,
        state.isArtist = false,
        state.isLogin = false
    }
  },
});

export const { setActiveSong, nextSong, prevSong, playPause, selectGenreListId, setLikeSongId, setRemoveSong, setRegisterLogin, setLogout } = playerSlice.actions;

export default playerSlice.reducer;