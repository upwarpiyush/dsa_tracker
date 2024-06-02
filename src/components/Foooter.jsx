import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import {setDarkMode} from "../slices/authSlice"
import { useSelector } from 'react-redux';

export const Foooter = () => {
    const {darkMode} = useSelector((state) => state.auth);
  // const [darkMode, setDarkMode] = useState(false);

    const dispatch = useDispatch()

    const toggleDarkMode = () =>{
        // setDarkMode(!darkMode);
        dispatch(setDarkMode(!darkMode));
    }
  return (
    <div className='w-full bg-green-600 py-2 fixed bottom-0 flex flex-row justify-between z-20 px-5 dark:bg-slate-700'>
        <div>
            <a className='bg-white px-3 py-0.5 rounded-2xl font-bold cursor-pointer' href='https://github.com/upwarpiyush/dsa_tracker' target='blank'>⭐ This project</a>
        </div>
        <div className='flex flex-row justify-center items-center gap-2'>
            <div className='bg-white px-3 py-0.5 rounded-2xl font-bold cursor-pointer' onClick={toggleDarkMode}>{darkMode ? "LHT ☀️" : "DRK 🌙"}</div>
            {/* <div className='bg-white px-3 py-0.5 rounded-2xl font-bold'>About 🧐</div> */}
        </div>
    </div>
  )
}
