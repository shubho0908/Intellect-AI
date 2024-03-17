import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDOzOrGwH-KsJtb8-ftOtunT9tnPHNlfYU",
  authDomain: "intellect-ai-2101e.firebaseapp.com",
  projectId: "intellect-ai-2101e",
  storageBucket: "intellect-ai-2101e.appspot.com",
  messagingSenderId: "504138480041",
  appId: "1:504138480041:web:35b7a987bea3bfc0da2cb8",
  measurementId: "G-7TTCYQE0Z1",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);