import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

window.addEventListener("DOMContentLoaded", () => {

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const menuContainer = document.getElementById("menu");

  async function loadMenu() {
    menuContainer.innerHTML = "<p>Chargement...</p>";

    const querySnapshot = await getDocs(collection(db, "produits"));

    // Regrouper par catégorie
    const categories = {};

    querySnapshot.forEach((docSnap) => {
      const p = docSnap.data();
      const cat = p.categorie || "autre";

      if (!categories[cat]) categories[cat] = [];
      categories[cat].push({ id: docSnap.id, ...p });
    });

    // Affichage
    menuContainer.innerHTML = "";

    for (const cat in categories) {

      // Titre de catégorie
      menuContainer.innerHTML += `
        <h2 style="color: var(--doré); margin-top: 25px;">${cat.toUpperCase()}</h2>
        <div class="menu-grid" id="cat-${cat}"></div>
      `;

      const catDiv = document.getElementById(`cat-${cat}`);

      categories[cat].forEach((p) => {
        catDiv.innerHTML += `
          <div class="menu-item">

            <div class="menu-info">
              <span class="menu-item-name">${p.nom}</span>
            </div>

            <div class="menu-right">
              <span class="menu-item-price">${p.prix} DT</span>

              <button class="add-to-cart"
                data-id="${p.id}"
                data-nom="${p.nom}"
                data-prix="${p.prix}">
                Ajouter
              </button>
            </div>

          </div>
        `;
      });
    }
  }

  loadMenu();

  // PANIER LOCAL
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {

      const id = e.target.dataset.id;
      const nom = e.target.dataset.nom;
      const prix = parseFloat(e.target.dataset.prix);

      cart.push({ id, nom, prix });

      localStorage.setItem("cart", JSON.stringify(cart));

      alert(nom + " ajouté au panier !");
    }
  });

});
