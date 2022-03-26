// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC90BZdkdJSTbFvG5CK5Moc6PWgNqL7tA0",
  authDomain: "star-wars-loretracker-11-4d.firebaseapp.com",
  databaseURL:
    "https://star-wars-loretracker-11-4d-default-rtdb.firebaseio.com",
  projectId: "star-wars-loretracker-11-4d",
  storageBucket: "star-wars-loretracker-11-4d.appspot.com",
  messagingSenderId: "447031913488",
  appId: "1:447031913488:web:ec952d0d99f6907672ee95",
  measurementId: "G-WEW3SZLHC9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
