// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAw5Naz4kfxL_5qOeY76Caljz5dzV7iNKU",
    authDomain: "preppal-42998.firebaseapp.com",
    projectId: "preppal-42998",
    storageBucket: "preppal-42998.firebasestorage.app",
    messagingSenderId: "256008834911",
    appId: "1:256008834911:web:8cacf94a6868484a9430ea",
    measurementId: "G-PNYQC45N6Y"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);