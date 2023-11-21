
import { auth } from "./config/firebase-config";
import MainPage from "./views/MainPage/MainPage"
import {useAuthState} from 'react-firebase-hooks/auth';
import {useEffect, useState} from "react";
import AppContext from "./context/AppContext";
import { Route, Routes } from 'react-router-dom'


function App() {


  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState({
    user,
    userData: null
  })


  if(appState.user !== user) {
    setAppState({user});
  }


  return (
    <>
    <AppContext.Provider value={{...appState, setContext: setAppState}}>
      <Routes>
      <Route path="/" element={<MainPage />} />
    </Routes>
    </AppContext.Provider>
    </>
  )
}

export default App
