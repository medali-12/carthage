import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔐 Vérification de connexion
onAuthStateChanged(auth, user => {
  if (!user) {
    // Pas connecté → redirection vers login
    window.location.href = "admin-login.html";
  }
});

// 🔐 Déconnexion
export function logout() {
  signOut(auth).then(() => {
    window.location.href = "admin-login.html";
  });
}
