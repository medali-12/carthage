import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, setDoc, doc, getDocs, deleteDoc } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// On attend que la page soit chargée
window.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("product-form");
  const tableBody = document.getElementById("products-table-body");

  // Si on n'est pas sur admin.html → on arrête
  if (!form || !tableBody) {
    console.warn("admin.js chargé mais pas sur admin.html — script ignoré.");
    return;
  }

  // Ajouter / modifier produit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("id").value;
    const nom = document.getElementById("nom").value;
    const categorie = document.getElementById("categorie").value;
    const prix = parseFloat(document.getElementById("prix").value);

    await setDoc(doc(db, "produits", id), {
      nom,
      categorie,
      prix
    });

    form.reset();
    loadProducts();
  });

  // Charger produits
  async function loadProducts() {
    tableBody.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "produits"));
    querySnapshot.forEach((docSnap) => {
      const p = docSnap.data();

      tableBody.innerHTML += `
        <tr>
          <td>${docSnap.id}</td>
          <td>${p.nom}</td>
          <td>${p.categorie}</td>
          <td>${p.prix} CHF</td>
          <td>
            <button onclick="deleteProduct('${docSnap.id}')">Supprimer</button>
          </td>
        </tr>
      `;
    });
  }

  window.deleteProduct = async function(id) {
    await deleteDoc(doc(db, "produits", id));
    loadProducts();
  };

  // Charger au démarrage
  loadProducts();
});
