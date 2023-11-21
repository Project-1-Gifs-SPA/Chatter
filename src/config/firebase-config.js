// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDTqimfLgpkyJw1JDm2UV_Kk0DX9wyeRGQ",
  authDomain: "chatter-app-52b85.firebaseapp.com",
  projectId: "chatter-app-52b85",
  storageBucket: "chatter-app-52b85.appspot.com",
  messagingSenderId: "580470035986",
  appId: "1:580470035986:web:cad987b9faa690516eaacb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// the Firebase authentication handler
export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);

export const storage = getStorage();
