// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwVT-XBQuFkWZGL27Oo2GSuTqR8OJc1iE",
  authDomain: "aura-aerospace-club.firebaseapp.com",
  projectId: "aura-aerospace-club",
  storageBucket: "aura-aerospace-club.appspot.com",
  messagingSenderId: "94668298411",
  appId: "1:94668298411:web:4d74dcd5d7bf428547ffee",
  measurementId: "G-EX9CWXSL0F"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, GoogleAuthProvider };
