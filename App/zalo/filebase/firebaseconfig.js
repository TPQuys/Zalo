// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBHnOhYJi7pzBkGOxmnMtfd267pHiLmajE",
  authDomain: "chat-app-98b52.firebaseapp.com",
  projectId: "chat-app-98b52",
  storageBucket: "chat-app-98b52.appspot.com",
  messagingSenderId: "530063644480",
  appId: "1:530063644480:web:7a9d1f0a70c7eaa7724ca5",
  measurementId: "G-KG6XDPE30V"
};
// export const firebaseConfig = {
//   apiKey: "AIzaSyBXcPl3o8zs7XoSvT5IOKM5cQraoU8ANgk",
//   authDomain: "chat-app2-1e67a.firebaseapp.com",
//   projectId: "chat-app2-1e67a",
//   storageBucket: "chat-app2-1e67a.appspot.com",
//   messagingSenderId: "753757078483",
//   appId: "1:753757078483:web:9d36013361912e38212526",
//   measurementId: "G-4LW86QZXP0"
// };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}