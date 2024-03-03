import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCvac5aUSuxLKqsiFIa05G6lLlWFx5_2CA",
  authDomain: "ai-app-d81ce.firebaseapp.com",
  projectId: "ai-app-d81ce",
  storageBucket: "ai-app-d81ce.appspot.com",
  messagingSenderId: "152121749178",
  appId: "1:152121749178:web:865d7db04db6eb20dc1c83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { app, storage };
