import { db } from "./firebase-config.js";
import { 
  getAuth, signInWithEmailAndPassword, 
  setPersistence, browserSessionPersistence 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase est déjà initialisé dans firebase-config.js
const auth = getAuth();

// Session expire au refresh
setPersistence(auth, browserSessionPersistence);

// Connexion admin
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      window.location.href = "admin.html";
    })
    .catch(() => {
      document.getElementById("error").textContent = 
        "Email ou mot de passe incorrect.";
    });
});
