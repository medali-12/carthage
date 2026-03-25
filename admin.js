import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔐 Déconnexion au refresh
setPersistence(auth, browserSessionPersistence);

// 🔐 Vérification si l'utilisateur est connecté
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "admin-login.html";
  }
});

// 🔐 Déconnexion manuelle
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "admin-login.html";
  });
});

// 🔥 Déconnexion automatique après 5 minutes d'inactivité
let timer;

function resetTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    signOut(auth).then(() => {
      alert("Déconnecté pour inactivité");
      window.location.href = "admin-login.html";
    });
  }, 300000); // 5 minutes
}

// Événements qui réinitialisent le timer
window.onload = resetTimer;
document.onmousemove = resetTimer;
document.onkeydown = resetTimer;
document.onclick = resetTimer;
document.onscroll = resetTimer;
