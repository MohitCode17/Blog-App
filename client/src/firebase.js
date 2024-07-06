// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fintech-blog-app.firebaseapp.com",
  projectId: "fintech-blog-app",
  storageBucket: "fintech-blog-app.appspot.com",
  messagingSenderId: "261080555498",
  appId: "1:261080555498:web:0d44876f9a5d2da09f5c93",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
