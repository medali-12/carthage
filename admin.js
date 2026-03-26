import { db } from "./firebase-config.js";
import { 
  getAuth, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase est déjà initialisé dans firebase-config.js
const auth = getAuth();

// 🔐 Déconnexion au refresh (session uniquement dans l’onglet)
setPersistence(auth, browserSessionPersistence);

// 🔐 Vérification si l'utilisateur est connecté
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "index.html"; // retour à l’accueil
  }
});

// 🔐 Déconnexion manuelle
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html"; // retour à l’accueil
  });
});

// 🔥 Déconnexion automatique après 3 minutes d'inactivité
let timer;

function resetTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    signOut(auth).then(() => {
      alert("Déconnecté pour inactivité");
      window.location.href = "index.html"; // retour à l’accueil
    });
  }, 180000); // 3 minutes
}

// Événements qui réinitialisent le timer
window.onload = resetTimer;
document.onmousemove = resetTimer;
document.onkeydown = resetTimer;
document.onclick = resetTimer;
document.onscroll = resetTimer;
