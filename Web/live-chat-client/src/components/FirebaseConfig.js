// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJCvkYrulYP8jcdMMH1mg7YlKmODY11zM",
  authDomain: "zalochatapp-59fbc.firebaseapp.com",
  projectId: "zalochatapp-59fbc",
  storageBucket: "zalochatapp-59fbc.appspot.com",
  messagingSenderId: "41656121245",
  appId: "1:41656121245:web:37a942fa5290e12c57e174",
  measurementId: "G-4VRR8D3X19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const database = getAuth(app)