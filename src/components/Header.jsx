import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../services/operations/authAPI';
import { useNavigate } from 'react-router-dom';

export const Header = () => {

    const {token} = useSelector( (state) => state.auth );
    // const {user} = useSelector( (state) => state.profile );
    const dispatch = useDispatch()
    const navigate = useNavigate()

  return (
    <div className='flex flex-col justify-center items-center py-5 border-b-black border fixed bg-white z-20 dark:bg-zinc-800 dark:text-white w-full'>
        
        {/* heading */}
        <div className='flex justify-center items-center flex-row gap-5 relative w-screen'>
            <Link to="/">
                <div className='font-bold tracking-wider font-mono xl:text-4xl lg:text-3xl md:text-2xl sm:text-lg'>DSA-Tracker</div>
            </Link>
            

            <div className='absolute right-10 flex flex-row gap-x-4 items-center'>
                {
                    token === null && (
                        <Link to="/login">
                            <button className='px-[30px] py-[10px] font-semibold hover:text-orange-600'>
                                Log In
                            </button>
                        </Link>
                    )
                }
                {
                    token === null && (
                        <Link to="/signup">
                            <button className='border border-black px-[25px] py-[10px] font-semibold rounded-md bg-orange-400 hover:rounded-3xl'>
                                Sign Up
                            </button>
                        </Link>
                    )
                }
                {
                    token !== null && (
                        <button className='border border-black px-[12px] py-[3px] text-cyan-700 rounded-md dark:bg-white dark:text-slate-900' onClick={()=>{
                            dispatch(logout(navigate))
                        }}>
                                Log Out
                        </button>
                    )
                }

            </div>
        </div>

    </div>
  )
}
