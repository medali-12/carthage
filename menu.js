import { db } from "./firebase-config.js";
import { collection, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function chargerMenu() {
  const querySnapshot = await getDocs(collection(db, "produits"));

  querySnapshot.forEach((doc) => {
    const p = doc.data();

    const imagePath = p.image || `images/${p.categorie}.jpg`;

    const container = document.getElementById(p.categorie);

    if (container) {
      container.innerHTML += `
        <div class="carte">
          <img src="${imagePath}" alt="${p.nom}">
          <h3>${p.nom}</h3>
          <p>${p.prix} CHF</p>
        </div>
      `;
    }
  });
}

chargerMenu();
