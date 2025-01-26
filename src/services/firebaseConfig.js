import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDgbZXkTsn2n9t_ffCNj00me3IKxQYadvs",
  authDomain: "talksphere-e2175.firebaseapp.com",
  projectId: "talksphere-e2175",
  storageBucket: "talksphere-e2175.firebasestorage.app",
  messagingSenderId: "301974369",
  appId: "1:301974369:web:0c02e5fa145246406d3b20",
  measurementId: "G-8647Q3748T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);