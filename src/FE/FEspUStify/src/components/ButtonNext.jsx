import React from "react";
const ButtonNext = ({onClick}) => {
  
    return (
        <button  type="button" className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-800 opacity-50" onClick = {onClick} >
        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
        
      </button>
    )
  
};
export default ButtonNext;