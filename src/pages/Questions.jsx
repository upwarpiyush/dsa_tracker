import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getQuestions } from '../services/operations/topicAPI';
import { eraseDoneQuestion, getDoneQuestions, setDoneQuestion } from '../services/operations/profileAPI';
import { useDispatch, useSelector } from 'react-redux';
import lc_logo from "../assets/lc_logo.png"
import cn_logo from "../assets/cn_logo.jpeg"
import gfg_logo from "../assets/gfg_logo.png"
import { Header } from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { Foooter } from '../components/Foooter';



export const Questions = () => {

  const navigate = useNavigate();

  const {token}  = useSelector((state) => state.auth);

  const {topicName, topicID} = useParams();

  const [questions, setQuestions] = useState([]);
  const [doneQuestions, setDoneQuestions] = useState([]);
  const [statQuestions, setStatQuestions] = useState([]);
  const [numDone, setNumDone] = useState(0);

  const [search, setSearch] = useState('');
  const [finalArr, setFinalArr] = useState([]);

  const {darkMode} = useSelector((state) => state.auth);


  const dispatch = useDispatch();


  const getQues = async() => {
    try{
        const response = await getQuestions(topicID);
        setQuestions(response);
        // console.log("ALL Questions..." , response);
    }
    catch(error) {
        console.log("Unable to Fetch Questions");
    }
  }

  const getDoneQues = async ()=>{
    try{
      const response = await getDoneQuestions(token,topicID);
      setDoneQuestions(response);
      console.log("ALL Done Questions..." , response);
    }
    catch(error) {
        console.log("Unable to Fetch Done Questions");
    }
  }


  useEffect(()=>{
    getQues();
    getDoneQues();
  },[token, topicID])


  useEffect(()=>{
    func();
  },[questions, doneQuestions])


  function func()
  {
    const questionsWithStatus = questions.map((question) => ({
      ...question,
      isDone: doneQuestions.includes(question._id),
    }));
    setStatQuestions(questionsWithStatus);
    setFinalArr(questionsWithStatus);
    // console.log("Questions with Status ", questionsWithStatus);
    setNumDone(doneQuestions.length);
  }

  const handelSetQuesChange = (index)=>{

    const flag = statQuestions[index].isDone;
    // console.log(flag);

    let newArr = statQuestions.map((item, i)=>{
      if(index == i)
      {
        return { ...item, isDone: !flag};
      }
      else{
        return item;
      }
    });
    setStatQuestions(newArr)
    setFinalArr(newArr);

    if(flag)
    {
      setNumDone(numDone - 1);
    }
    else{
      setNumDone(numDone + 1);
    }
  }

  function solveHandler(index, e){

    const flag = statQuestions[index].isDone;
    const title = statQuestions[index].title;

    if(flag)
    {
      dispatch(eraseDoneQuestion(topicName, title, token));
    }
    else{
      dispatch(setDoneQuestion(topicName, title, token));
    }
    handelSetQuesChange(index);

  }

  function filterSearch(searchValue)
  {
    // console.log(searchValue);
    return statQuestions.filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase()));
  }

  function searchHandler(e){
    const searchValue = e.target.value;
    setSearch(searchValue);
    const filteredArr = filterSearch(searchValue);
    
    setFinalArr([...filteredArr]);
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomHandler(){
    const randomNumber = getRandomNumber(0, questions.length - 1);
    // console.log(finalArr[randomNumber]);
    const item = finalArr[randomNumber];
    window.open(item.link, '_blank');
  }


  return (
    <div className={`${darkMode && "dark"}`}>

      <Header/>

      <div className='flex flex-col items-center justify-center pt-24 mb-3 pb-10 gap-5 dark:bg-zinc-900'>

        <div className=''>
          <span className='text-2xl font-semibold tracking-widest hover:underline cursor-pointer hover:text-blue-500 dark:text-white' onClick={()=>navigate("/landing")}>Topics</span>
          <span className='text-2xl dark:text-white'>/ </span>
          <span className='text-rose-500 font-mono text-xl'>{`${topicName}`}</span>
        </div>

        <div className=' w-4/5 flex flex-row items-center justify-evenly'>

          <button className="bg-transparent hover:bg-blue-500 text-blue-500 font-semibold hover:text-white py-2 px-4 border-2 border-blue-500 hover:border-transparent rounded" onClick={()=>randomHandler()}>
            Pick Random 💡
          </button>

          <div className="w-3/5 flex px-4 py-3 rounded-md border-2 border-blue-500 overflow-hidden font-[sans-serif]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px"
              className="fill-gray-600 mr-3 rotate-90">
              <path
                d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
              </path>
            </svg>
            <input type="text" placeholder="Search Question..." className="w-full outline-none bg-transparent text-gray-600 text-sm" onChange={(e)=>searchHandler(e)} />
          </div>

          <div className='text-md dark:text-white '>{`${numDone}/${questions.length} - `}<span className='font-semibold text-sky-600'>Done</span></div>

        </div>

        <table className='outline outline-2 outline-black w-[80%] dark:outline-white'>
          <thead className='bg-cyan-400 text-md h-10 dark:bg-opacity-60'>
            <tr className='outline outline-1  outline-black dark:outline-white'>
              <th className='outline outline-1 py-3 outline-black w-[5%] dark:outline-white'>id</th>
              <th className='outline outline-1 outline-black w-[75%] dark:outline-white'>Questions</th>
              <th className='outline outline-1 outline-black dark:outline-white'>Link</th>
              <th className='outline outline-1 outline-black dark:outline-white'>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              finalArr.map((q, index)=>{
                // console.log(index);
                // console.log(q);
                const {title, link, isDone} = q;
                return(
                  <tr key={index} className={`outline-2 outline-black dark:outline-white h-10 ${isDone?'bg-green-100 dark:bg-zinc-700 dark:text-white':'bg-slate-50 dark:bg-zinc-900 dark:text-white'}`}>
                    
                    <td className='outline outline-1 outline-black  mx-auto text-sm text-center dark:outline-white'>{index}</td>

                    <td className='outline outline-1 outline-black  mx-auto text-sm px-5 dark:outline-white'>{title}</td>

                    <td className='outline outline-1 outline-black flex justify-center items-center dark:outline-white'>

                      <a target='_blank' href={`${link}`}>
                        {link.includes("leetcode") ? <img src={lc_logo} className={` w-10 rounded-full bg-white border-none p-2 ${isDone?'bg-green-100 dark:bg-zinc-700 dark:text-white':'bg-slate-100 dark:bg-zinc-900 dark:text-white'}`}/> 
                        : link.includes("codingninjas") ? <img src={cn_logo} className={`w-10 rounded-full bg-white border-none p-2 ${isDone?'bg-green-100 dark:bg-zinc-700 dark:text-white':'bg-slate-100 dark:bg-zinc-900 dark:text-white'}`}/> 
                        : <img src={gfg_logo} className={` w-10 rounded-full bg-white border-none p-2 ${isDone?'bg-green-100 dark:bg-zinc-700 dark:text-white':'bg-slate-100 dark:bg-zinc-900 dark:text-white'}`}/>}
                      </a>

                      </td>


                    <td className={`outline outline-1 outline-black  mx-auto text-sm text-center dark:outline-white ${isDone?'bg-green-100 dark:bg-zinc-700 dark:text-white':'bg-slate-100 dark:bg-zinc-900 dark:text-white'}`}>

                      <select className={`w-full h-full px-4  outline-none text-sm mx-auto ${isDone?'bg-green-100 dark:bg-zinc-700 dark:text-white':'bg-slate-100 dark:bg-zinc-900 dark:text-white'} cursor-pointer`} value={isDone} onChange={(e)=>solveHandler(index,e)}>
                        <option value={false} >Unsolved</option>
                        <option value={true}>Solved</option>
                      </select>

                    </td>

                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
      <Foooter />
    </div>
  )
}
