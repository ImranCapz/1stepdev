// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "step-1d272.firebaseapp.com",
  projectId: "step-1d272",
  storageBucket: "step-1d272.appspot.com",
  messagingSenderId: "833106800742",
  appId: "1:833106800742:web:946fa4a9b0a173590f3da7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);