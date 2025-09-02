// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKC28V3XiS1totwHeZ66P1qdUjNUGC2Sw",
  authDomain: "axn-tms.firebaseapp.com",
  projectId: "axn-tms",
  storageBucket: "axn-tms.firebasestorage.app",
  messagingSenderId: "305731541779",
  appId: "1:305731541779:web:32dc51104d4ae710aa98e6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
