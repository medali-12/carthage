import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

window.addEventListener("DOMContentLoaded", () => {

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const menuContainer = document.getElementById("menu");

  if (!menuContainer) {
    console.error("ERREUR : L'élément #menu est introuvable !");
    return;
  }

  async function loadMenu() {
    menuContainer.innerHTML = "<p>Chargement...</p>";

    const querySnapshot = await getDocs(collection(db, "produits"));

    menuContainer.innerHTML = ""; // vider

    querySnapshot.forEach((docSnap) => {
      const p = docSnap.data();

      menuContainer.innerHTML += `
        <div class="menu-item">
          <span class="menu-item-name">${p.nom}</span>
          <span class="menu-item-price">${p.prix} DT</span>
        </div>
      `;
    });

    if (menuContainer.innerHTML.trim() === "") {
      menuContainer.innerHTML = "<p>Aucun produit pour le moment.</p>";
    }
  }

  loadMenu();
});
