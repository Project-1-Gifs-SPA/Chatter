
import { auth } from "./config/firebase-config";
import MainPage from "./views/MainPage/MainPage"
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from "react";
import AppContext from "./context/AppContext";
import { Route, Routes } from 'react-router-dom'
import LandingPage from "./views/LandingPage/LandingPage";
import AuthenticatedRoute from "./hoc/AuthenticatedRoute";
import SignIn from "./views/SignIn/SignIn";
import SignUp from "./views/SignUp/SignUp";
import { changeUserStatus, getUserData } from "./services/users.service";
import Loader from "./components/Loader/Loader";
import Profile from "./views/Profile/Profile";
import { statuses } from "./common/constants";


function App() {

  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState({
    user,
    userData: null
  })
  const [loading, setLoading] = useState(true)

  if (appState.user !== user) {
    setAppState({ user, userData: null });
  }

  useEffect(() => {

    if (user === null) {
      return;
    }

    getUserData(user.uid)
      .then(snapshot => {
        if (!snapshot.exists()) {
          throw new Error('User data not found');
        }
        const currentUserData = snapshot.val()[Object.keys(snapshot.val())[0]];
        changeUserStatus(currentUserData.handle, statuses.online)

        setAppState({
          ...appState,
          userData: currentUserData,
        })
        setLoading(false)
      })

  }, [user]);

  return (
    <>
      <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
        {!loading ? (
          <Routes>
            <Route path='/welcome' element={<LandingPage />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path="/" element={<AuthenticatedRoute><MainPage /></AuthenticatedRoute>} />
            <Route path="/teams/:teamId" element={<AuthenticatedRoute><MainPage /></AuthenticatedRoute>} />
            <Route path="/dms/:dmId" element={<AuthenticatedRoute><MainPage /></AuthenticatedRoute>} />
            <Route path="/profile" element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>} />
          </Routes>
        ) : <Loader />
        }
      </AppContext.Provider>
    </>
  )
}

export default App
