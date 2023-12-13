import { useEffect, useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Route, Routes } from 'react-router-dom';
import { statuses } from "./common/constants";
import Loader from "./components/Loader/Loader";
import { auth } from "./config/firebase-config";
import AppContext from "./context/AppContext";
import AuthenticatedRoute from "./hoc/AuthenticatedRoute";
import { changeUserStatus, getUserData } from "./services/users.service";
import LandingPage from "./views/LandingPage/LandingPage";
import MainPage from "./views/MainPage/MainPage";
import Profile from "./views/Profile/Profile";
import SignIn from "./views/SignIn/SignIn";
import SignUp from "./views/SignUp/SignUp";

function App() {

  const [user] = useAuthState(auth);

  const [appState, setAppState] = useState({
    user,
    userData: null
  });
  const [loading, setLoading] = useState(false);

  if (appState.user !== user) {
    setAppState({ user, userData: null });
  }

  useEffect(() => {
    if (user === null) {
      setLoading(false)
      return;
    }

    setLoading(true);

    getUserData(user.uid)
      .then(snapshot => {
        if (!snapshot.exists()) {
          throw new Error('User data not found');
        }

        const currentUserData = snapshot.val()[Object.keys(snapshot.val())[0]];
        changeUserStatus(currentUserData.handle, statuses.online);

        setAppState({
          ...appState,
          userData: currentUserData,
        });

        setLoading(false);
      })
      .catch((e) => console.error(e));
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
            <Route path="/teams/:teamId/channels/:channelId" element={<AuthenticatedRoute><MainPage /></AuthenticatedRoute>} />
            <Route path="/meetings/:meetingId" element={<AuthenticatedRoute><MainPage /></AuthenticatedRoute>} />
            <Route path="/meetings/:meetingId/room/:roomId" element={<AuthenticatedRoute><MainPage /></AuthenticatedRoute>} />
            <Route path="/dms/:dmId" element={<AuthenticatedRoute><MainPage /></AuthenticatedRoute>} />
            <Route path="/profile" element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>} />
          </Routes>
        ) : <Loader />
        }
      </AppContext.Provider>
    </>
  );
}

export default App;
