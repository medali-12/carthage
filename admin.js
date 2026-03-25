import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔐 Vérification si l'utilisateur est connecté
onAuthStateChanged(auth, user => {
  if (!user) {
    // Pas connecté → redirection vers login
    window.location.href = "admin-login.html";
  }
});

// 🔐 Déconnexion
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "admin-login.html";
  });
});
