"use client";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0qc8IJ6ikEc_MR00xuRJ5MuVw6qYOXZI",
  authDomain: "matchio-2d529.firebaseapp.com",
  projectId: "matchio-2d529",
  storageBucket: "matchio-2d529.firebasestorage.app",
  messagingSenderId: "206617889908",
  appId: "1:206617889908:web:f617bdda0e987a271e9521",
  measurementId: "G-26GRVJGV1Z",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);