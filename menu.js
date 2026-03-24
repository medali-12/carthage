import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const menuContainer = document.getElementById("menu-container");

async function loadMenu() {
  menuContainer.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "produits"));
  querySnapshot.forEach((docSnap) => {
    const p = docSnap.data();

    menuContainer.innerHTML += `
      <div class="menu-item">
        <span class="menu-item-name">${p.nom}</span>
        <span class="menu-item-price">${p.prix} CHF</span>
      </div>
    `;
  });
}

loadMenu();
