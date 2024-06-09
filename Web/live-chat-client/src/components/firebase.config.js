// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6fZSKIVTEipvgDiGIBMV5OmccTX6V21I",
  authDomain: "otp-project-cd485.firebaseapp.com",
  projectId: "otp-project-cd485",
  storageBucket: "otp-project-cd485.appspot.com",
  messagingSenderId: "753045537477",
  appId: "1:753045537477:web:5068c1386b766b678f26ac",
  measurementId: "G-2W22K20CGR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);