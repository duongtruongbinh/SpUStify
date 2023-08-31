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
  isArtist: true,
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
  
    setLikeSongId: (state , action) => {
           
      state.likedSongsId = [...state.likedSongsId, action.payload];
          },
    setRemoveSong: (state, action) => {
      state.likedSongsId = state.likedSongsId.filter(song => song !== action.payload);
    },
   

  },
});

export const { setActiveSong, nextSong, prevSong, playPause, selectGenreListId, setLikeSongId, setRemoveSong} = playerSlice.actions;

export default playerSlice.reducer;
