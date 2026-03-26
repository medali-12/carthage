import { db } from "./firebase-config.js";
import { 
  getAuth, onAuthStateChanged, signOut, 
  setPersistence, inMemoryPersistence 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

// 🟥 FORCER la perte de session au refresh
sessionStorage.clear();

// 🔐 Session uniquement en mémoire → perdue au refresh
setPersistence(auth, inMemoryPersistence).then(() => {

  // Vérification si l'utilisateur est connecté
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = "admin-login.html"; // page de login
    }
  });

  // Déconnexion manuelle
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).then(() => {
        window.location.href = "admin-login.html";
      });
    });
  }

  // Déconnexion automatique après 3 minutes d'inactivité
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

  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;
  document.onclick = resetTimer;
  document.onscroll = resetTimer;

});
