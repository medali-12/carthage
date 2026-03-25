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
          <button class="add-btn" data-id="${doc.id}" data-nom="${p.nom}" data-prix="${p.prix}">
            Ajouter
          </button>
        </div>
      `;
    }
  });

  activerBoutons();
}

function activerBoutons() {
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const nom = btn.dataset.nom;
      const prix = parseFloat(btn.dataset.prix);

      let panier = JSON.parse(localStorage.getItem("panier")) || [];

      panier.push({ nom, prix });

      localStorage.setItem("panier", JSON.stringify(panier));

      alert(`${nom} ajouté au panier`);
    });
  });
}

chargerMenu();
