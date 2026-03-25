import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCzmBq6kM8ufzwzxSO6P-fB8AXxXfBaCQ8",
  authDomain: "carthage-cafe.firebaseapp.com",
  projectId: "carthage-cafe",
  storageBucket: "carthage-cafe.appspot.com",
  messagingSenderId: "701972195657",
  appId: "1:701972195657:web:7baec9607886e0b97ed298",
  measurementId: "G-L2X433VK0M"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
