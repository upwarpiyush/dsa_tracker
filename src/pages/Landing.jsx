import React, { useEffect } from 'react'
import { useState } from 'react';
import { getAllTopics } from '../services/operations/topicAPI';
import { getAllDoneTopics } from '../services/operations/profileAPI';
import { useSelector } from 'react-redux';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { apiConnector } from "../services/apiconnector";

import notification_logo from "../assets/bell.png"
import {Foooter} from '../components/Foooter';

export const Landing = () => {

  const [topics, setTopics] = useState(null);
  const [done, setDone] = useState(null);

  const [doneTopics, setDoneTopics] = useState(null);

  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalDoneQuestions, setTotalDoneQuestions] = useState(0);

  const [notificationPermission, setNotificationPermission] = useState('')

  const {token}  = useSelector((state) => state.auth);
  const {user} = useSelector( (state) => state.profile );

  const {darkMode} = useSelector((state) => state.auth);


  const registerServiceWorkerAndSubscribe = async () => {
      try {
        console.log("Inside function......1");
        // console.log(token);
        if ("serviceWorker" in navigator) {
          // Register the service worker
          const register = await navigator.serviceWorker.register("/sw.js");

          console.log("Inside function......2");

          // Check current notification permission
          const permission = Notification.permission;

          setNotificationPermission(permission);

          if (permission === "default") {
            // Request permission for push notifications
            const newPermission = await Notification.requestPermission();

            if (newPermission === "granted") {
              // Permission granted, subscribe to push notifications
              console.log("vapid key......",process.env.VAPID_PUBLIC_KEY)
              const applicationServerKey = urlBase64ToUint8Array(process.env.VAPID_PUBLIC_KEY);
              const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey,
              });

            console.log("Inside function......3");

            const res = await apiConnector(
              "POST", 
              `${process.env.REACT_APP_BASE_URL}/subscribe`, 
              {uid:user._id, subscription},
              {"content-type": "application/json"},
            );

            console.log("Inside function......4");

              if (!res.ok) {
                throw new Error(`Subscription failed: ${res.statusText}`);
              }

              console.log("Subscription successful:", await res.json());
            } else {
              console.log("Permission for notifications not granted.");
            }
          } else if (permission === "denied") {
            console.log("Permission for notifications denied.");
          } else {
            console.log("Notification permission already granted.");
          }
        } else {
          console.error("Service workers are not supported in this browser.");
        }
      } catch (error) {
        console.error("Error during service worker registration or push subscription:", error);
      }
    };

    const urlBase64ToUint8Array = (base64String) => {
      if (!base64String) {
        // throw new Error("VAPID public key is not defined");
        console.log("VAPID public key is not defined");
      }
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    };

  const getTopics = async() => {
      try{
          const response = await getAllTopics();
          setTopics(response);
          // console.log("ALL Topics..." , response);
      }
      catch(error) {
          console.log("Unable to Fetch Topics");
      }
  }

  const getDoneTopics = async()=>{
    try{
      const response = await getAllDoneTopics(token);
      // console.log("I AM HERE>>>>>>", response);
      setDone(response);
    }
    catch(error)
    {
      console.log("Unable to Fetch Done Topics")
    }
  }

  useEffect(()=> {
    getTopics();
    getDoneTopics();
    
  },[]);

  useEffect(()=>{
    fun();
  },[done, topics])

  useEffect(()=>{
    const noti_permission = Notification.permission;
    setNotificationPermission(noti_permission);
  },[])

  function fun(){
    const arr = [];
    let doneQue = 0;
    let totalQue = 0;
    if(done && topics)
    {
      // const arr = [];
      // let doneQue = 0;
      // let totalQue = 0;
      for(const item of topics)
      {
        let flag = false;
        for(const doneItem of done)
        {
          if(item._id === doneItem.topic_id._id )
          {
            flag = true;
            const obj1 = {
              ...item, 
              done_questions: doneItem.question_id.length,
              total_questions: item.Questions.length,
            }
            arr.push(obj1);
            doneQue += doneItem.question_id.length;
            totalQue += item.Questions.length;
          }
        }
        if(flag === false)
        {
          const obj2 = {
            ...item, 
            done_questions: 0,
            total_questions: item.Questions.length,
          }
          // console.log(obj);
          arr.push(obj2);
          totalQue += item.Questions.length;
        }
      }

      // console.log(arr);
      // console.log(doneQue);
      // console.log(totalQue);
      // setDoneTopics(arr);
      // setTotalDoneQuestions(doneQue);
      // setTotalQuestions(totalQue);
    }
    setDoneTopics(arr);
    setTotalDoneQuestions(doneQue);
    setTotalQuestions(totalQue);
  }

  function calcPercentage(){
    let percentage = totalDoneQuestions/totalQuestions * 100;
    // percentage.toFixed(2);
    return percentage.toFixed(2);
  }
   
  return (
    <div className={`${darkMode && "dark"}`}>
      <Header/>
    <div className=' flex justify-center items-center flex-col pb-10 pt-[100px] relative bg-white dark:bg-zinc-900'>
      <div className='z-10 fixed pt-5 top-20 bg-white w-full flex flex-col items-center justify-center dark:bg-zinc-900 dark:text-white'>
      <div className='text-xl font-medium tracking-wider '>Your Getway To Crack DSA 😍</div>

      { totalDoneQuestions>0 ? 
      (<div className=' text-md mt-2 mb-5 flex items-center justify-center flex-col gap-3'>
          <div className='text-lg text-sky-800 dark:text-slate-200'>Total Questions Solved : <span> {totalDoneQuestions} </span> <span>{`( ${calcPercentage()}% Done )`}</span></div>
          <div className='w-[60vw]  h-4 bg-gray-100 border-2 border-gray-900 rounded-sm z-10'>
            <div style={{ width: `${calcPercentage()}%`}} className=' rounded-sm h-full bg-orange-500'></div>
          </div>
        </div>) : (<div className=' text-xl mt-5 font-mono'> Start Solving </div>)
      }
      </div>
      

        

        {/* Topic Cards */}
        <div className='pt-28'>
          { notificationPermission === "default" ? (
          <div className={`flex flex-row gap-5 justify-center items-center bg-gradient-to-r from-orange-500 to-red-400 animate-gradient w-4/5 mx-auto rounded-2xl `}>
            <div>We'd like to send you notifications. Please click the bell icon to grant permission.</div>
            <div className='animate-pulse focus:animate-none hover:animate-none inline-flex bg-rose-60 py-2 rounded-full tracking-wide text-white cursor-pointer' onClick={registerServiceWorkerAndSubscribe}>
                <img src={notification_logo} alt="" className='w-8' title='turn on notification'/>
            </div>
          </div>) : (null)
          }
        {
          !doneTopics ? (<div> Loading... </div>) : !doneTopics.length ? (<p>NO Topic Listed Till Now.....</p>) : 
          (<div className=' w-full flex items-center justify-center flex-wrap '>
            {
              doneTopics.map((card)=>{
                return (typeof(card) == "object") ? (<Card cardData={card} key={card._id}></Card>):(<div>NaN</div>)
              })
            }
          </div>)
        }
        </div>
    </div>

    <Foooter />
    </div>
  )
}

