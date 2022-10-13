// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCv2fWmd1fAIomfDqs7_oKvtixjTzgkfjs",
  authDomain: "expense-tracker-f8536.firebaseapp.com",
  projectId: "expense-tracker-f8536",
  storageBucket: "expense-tracker-f8536.appspot.com",
  messagingSenderId: "242567685551",
  appId: "1:242567685551:web:f97a2f0da17024c4737b5a",
  measurementId: "G-7D7XNTKN11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export {app};
// const analytics = getAnalytics(app);