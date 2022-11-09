// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyApv2n-bsm3boO9xBINZN1DDu7rr2krUgw",
  authDomain: "textbookexchange-15746.firebaseapp.com",
  projectId: "textbookexchange-15746",
  storageBucket: "textbookexchange-15746.appspot.com",
  messagingSenderId: "848595168556",
  appId: "1:848595168556:web:ac25950042eb0d882f5089",
  measurementId: "G-V4KPGJSV9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {experimentalForceLongPolling: true});

export { db, auth };