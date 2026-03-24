import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Connexion (login.html)
const form = document.getElementById("login-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      window.location.href = "admin.html";
    } catch (err) {
      document.getElementById("error").textContent = "Identifiants incorrects";
    }
  });
}

// Protection admin.html
export function protectAdmin() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
}

// Déconnexion → retour accueil
export function logout() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
}

/* AUTO-LOGOUT 5 MINUTES — uniquement sur admin.html */
function startAutoLogout() {
  if (!window.location.pathname.includes("admin.html")) return;

  let timer;

  function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      signOut(auth).then(() => {
        window.location.href = "index.html";
      });
    }, 5 * 60 * 1000); // 5 minutes
  }

  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;
  document.onclick = resetTimer;
  document.onscroll = resetTimer;
}

onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.includes("admin.html")) {
    startAutoLogout();
  }
});
