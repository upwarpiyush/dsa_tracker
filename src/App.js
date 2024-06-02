import "./App.css";
import { Auth } from "./pages/Auth";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import OpenRoute from "./components/core/Auth/OpenRoute";

import UpdatePassword from "./pages/UpdatePassword";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import { Landing } from "./pages/Landing";
import {Questions} from "./pages/Questions";
import { Configuration } from "./pages/Configuration";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error";


function App() {

  // const {user} = useSelector( (state) => state.profile );
  // const {token} = useSelector( (state) => state.auth );
  // const [grantPermission, setGrantPermission] = useState(false);
  

  // useEffect(() => {
  //   const registerServiceWorkerAndSubscribe = async () => {
  //     try {
  //       // console.log(token);
  //       if ("serviceWorker" in navigator) {
  //         // Register the service worker
  //         const register = await navigator.serviceWorker.register("/sw.js");

  //         // Check current notification permission
  //         const permission = await Notification.permission;

  //         if (permission === "default") {
  //           // Request permission for push notifications
  //           const newPermission = await Notification.requestPermission();

  //           if (newPermission === "granted") {
  //             // Permission granted, subscribe to push notifications
  //             const subscription = await register.pushManager.subscribe({
  //               userVisibleOnly: true,
  //               applicationServerKey: process.env.VAPID_PUBLIC_KEY
  //             });

  //           const res = await apiConnector(
  //             "POST", 
  //             `${process.env.REACT_APP_BASE_URL}/subscribe`, 
  //             {uid:user._id, subscription},
  //             {Authorisation: `Bearer ${token}`},
  //           );

  //             if (!res.ok) {
  //               throw new Error(`Subscription failed: ${res.statusText}`);
  //             }

  //             console.log("Subscription successful:", await res.json());
  //           } else {
  //             console.log("Permission for notifications not granted.");
  //           }
  //         } else if (permission === "denied") {
  //           console.log("Permission for notifications denied.");
  //         } else {
  //           console.log("Notification permission already granted.");
  //         }
  //       } else {
  //         console.error("Service workers are not supported in this browser.");
  //       }
  //     } catch (error) {
  //       console.error("Error during service worker registration or push subscription:", error);
  //     }
  //   };

  //   registerServiceWorkerAndSubscribe();
  // }, []);
    const {darkMode} = useSelector((state) => state.auth);
   
  return (
    
    <div className={`${darkMode && "dark"}`}>
    <div className="min-h-screen max-w-screen overflow-x-hidden dark:bg-zinc-900">
      {/* <Header/> */}
      <Routes>

        <Route path="/" element={<Auth/>} />
        <Route
            path="signUp"
            element={
              <OpenRoute>
                <SignUp />
              </OpenRoute>
            }
          />
        <Route
            path="login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

        <Route
            path="forgot-password"
            element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />  

        <Route
            path="verify-email"
            element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />  

        <Route
            path="update-password/:id"
            element={
              <OpenRoute>
                <UpdatePassword />
              </OpenRoute>
            }
          />

        <Route path="landing" 
        element={
          <PrivateRoute>
            <Landing />
          </PrivateRoute>
        } />

        <Route path="questions/:topicName/:topicID" 
        element={
          <PrivateRoute>
            <Questions />
          </PrivateRoute>
        } />

        <Route path="config" 
        element={
          <PrivateRoute>
            <Configuration/>
          </PrivateRoute>
        }></Route>

        <Route path="*" element={<Error />} />
      </Routes>

      
      {/* <Footer/> */}
    </div>
    </div>
  );
}

export default App;
