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

    menuContainer.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
      const p = docSnap.data();

      menuContainer.innerHTML += `
        <div class="menu-item">
          <span class="menu-item-name">${p.nom}</span>
          <span class="menu-item-price">${p.prix} DT</span>
          <button class="add-to-cart"
            data-id="${docSnap.id}"
            data-nom="${p.nom}"
            data-prix="${p.prix}">
            Ajouter
          </button>
        </div>
      `;
    });
  }

  loadMenu();

  // PANIER LOCAL
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // AJOUTER AU PANIER (compatible téléphone)
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
