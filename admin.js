import { db } from "./firebase-config.js";
import { 
  getAuth, onAuthStateChanged, signOut, 
  setPersistence, browserSessionPersistence 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

// 🔐 IMPORTANT : définir la persistance AVANT toute autre action
setPersistence(auth, browserSessionPersistence).then(() => {

  // 🔐 Vérification si l'utilisateur est connecté
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = "admin-login.html"; // retour vers login
    }
  });

  // 🔐 Déconnexion manuelle
  document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "admin-login.html";
    });
  });

  // 🔥 Déconnexion automatique après 3 minutes d'inactivité
  let timer;

  function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      signOut(auth).then(() => {
        alert("Déconnecté pour inactivité");
        window.location.href = "admin-login.html";
      });
    }, 180000); // 3 minutes
  }

  // Événements qui réinitialisent le timer
  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;
  document.onclick = resetTimer;
  document.onscroll = resetTimer;

});
