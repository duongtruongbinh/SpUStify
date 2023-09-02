import React from "react";
import { Link } from "react-router-dom";
import Na from "../assets/Liu-Grace.jpeg";

import PlayPause from './PlayPause';
import { useSelector, useDispatch } from 'react-redux';
import {AiFillEdit} from 'react-icons/ai';


const UserHeader = ({ songData}) => {
    console.log("hello")
console.log(songData.username)
  const dispatch = useDispatch();

  return (
  <div className="relative w-full flex flex-col">
    <div
      className="w-full bg-gradient-to-l from-transparent to-violet-900 sm:h-48 h-28"
      style={{
        backgroundImage: Na,
      }}
    />

    <div className="absolute inset-0 flex items-center">
      <img
        alt="profile"
        src={Na}
        className="sm:w-48 w-28 sm:h-48 h-28 rounded-full object-cover border-2 shadow-xl shadow-black"
      />

      <div className="ml-5 flex flex-row items-center gap-6">
        <p className="font-bold sm:text-3xl text-xl text-gray-100">
          {songData?.username}
        </p>
       
         
      
       
      </div>
    </div>

    <div className="w-full sm:h-44 h-24" />
  </div>
);
      }
export default UserHeader;