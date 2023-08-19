import { createSlice } from '@reduxjs/toolkit';
import { useState } from 'react';
const initialState = {
  currentSongs: [],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  activeSong: {},
  genreListId: '',
  likedSongsId: [],
  
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  
  reducers: {
    setActiveSong: (state, action) => {
      state.activeSong = action.payload.song;

      if (action.payload?.data?.tracks?.hits) {
        state.currentSongs = action.payload.data.tracks.hits;
      } else if (action.payload?.data?.properties) {
        state.currentSongs = action.payload?.data?.tracks;
      } else {
        state.currentSongs = action.payload.data;
      }

      state.currentIndex = action.payload.i;
      state.isActive = true;
    },

    nextSong: (state, action) => {
      if (state.currentSongs[action.payload]?.track) {
        state.activeSong = state.currentSongs[action.payload]?.track;
      } else {
        state.activeSong = state.currentSongs[action.payload];
      }

      state.currentIndex = action.payload;
      state.isActive = true;
    },

    prevSong: (state, action) => {
      if (state.currentSongs[action.payload]?.track) {
        state.activeSong = state.currentSongs[action.payload]?.track;
      } else {
        state.activeSong = state.currentSongs[action.payload];
      }

      state.currentIndex = action.payload;
      state.isActive = true;
    },

    playPause: (state, action) => {
      state.isPlaying = action.payload;
    },

    selectGenreListId: (state, action) => {
      state.genreListId = action.payload;
    },
  
    setLikeSongId: (state , action) => {
           
      state.likedSongsId = [...state.likedSongsId, action.payload];
          },
    setRemoveSong: (state, action) => {
      state.likedSongsId = state.likedSongsId.filter(song => song.id !== action.payload);
    },
   

  },
});

export const { setActiveSong, nextSong, prevSong, playPause, selectGenreListId, setLikeSongId, setRemoveSong} = playerSlice.actions;

export default playerSlice.reducer;
