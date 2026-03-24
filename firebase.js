import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuration Firebase (celle que tu as copiée)
const firebaseConfig = {
  apiKey: "AIzaSyCzmBq6kM8ufzwzxSO6P-fB8AXxXfBaCQ8",
  authDomain: "carthage-cafe.firebaseapp.com",
  projectId: "carthage-cafe",
  storageBucket: "carthage-cafe.firebasestorage.app",
  messagingSenderId: "701972195657",
  appId: "1:701972195657:web:7baec9607886e0b97ed298",
  measurementId: "G-L2X433VK0M"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore
export const db = getFirestore(app);
