import { db } from "./firebase-config.js";
import { 
  getAuth, onAuthStateChanged, signOut, 
  setPersistence, browserSessionPersistence 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

// 🔥 Détecter un refresh
if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
  sessionStorage.setItem("forceLogout", "1");
}

// 🔐 Persistance normale (garde la session entre pages)
setPersistence(auth, browserSessionPersistence).then(() => {

  onAuthStateChanged(auth, user => {

    // 🔥 Si refresh → déconnexion
    if (sessionStorage.getItem("forceLogout") === "1") {
      sessionStorage.removeItem("forceLogout");
      signOut(auth);
      return;
    }

    // 🔐 Si pas connecté → login
    if (!user) {
      window.location.href = "admin-login.html";
    }
  });

  // 🔐 Déconnexion manuelle
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).then(() => {
        window.location.href = "admin-login.html";
      });
    });
  }

  // 🔥 Déconnexion automatique après 3 minutes
  let timer;
  function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      signOut(auth).then(() => {
        alert("Déconnecté pour inactivité");
        window.location.href = "admin-login.html";
      });
    }, 180000);
  }

  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;
  document.onclick = resetTimer;
  document.onscroll = resetTimer;

});
