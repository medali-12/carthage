import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const productsBody = document.getElementById("products-body");
const form = document.getElementById("product-form");
const inputId = document.getElementById("product-id");
const inputName = document.getElementById("product-name");
const inputPrice = document.getElementById("product-price");
const inputCategory = document.getElementById("product-category");
const cancelEditBtn = document.getElementById("cancel-edit");

let isEditing = false;

// Charger la liste des produits
async function loadProducts() {
  productsBody.innerHTML = "<tr><td colspan='5'>Chargement...</td></tr>";

  const snap = await getDocs(collection(db, "produits"));
  productsBody.innerHTML = "";

  snap.forEach(docSnap => {
    const item = docSnap.data();
    const id = docSnap.id;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price} DT</td>
      <td>${item.category || ""}</td>
      <td>${item.available ? "Oui" : "Non"}</td>
      <td>
        <button class="btn btn-outline" data-action="edit" data-id="${id}">Modifier</button>
        <button class="btn btn-outline" data-action="toggle" data-id="${id}">
          ${item.available ? "Rendre indisponible" : "Rendre disponible"}
        </button>
        <button class="btn btn-outline" data-action="delete" data-id="${id}">Supprimer</button>
      </td>
    `;
    productsBody.appendChild(tr);
  });

  if (!productsBody.innerHTML.trim()) {
    productsBody.innerHTML = "<tr><td colspan='5'>Aucun produit.</td></tr>";
  }
}

// Soumission du formulaire (ajout / modification)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = inputName.value.trim();
  const price = Number(inputPrice.value);
  const category = inputCategory.value.trim();

  if (!name || !category || isNaN(price)) {
    alert("Veuillez remplir tous les champs correctement.");
    return;
  }

  try {
    if (isEditing && inputId.value) {
      // Modifier
      await updateDoc(doc(db, "produits", inputId.value), {
        name,
        price,
        category
      });
      alert("Produit modifié.");
    } else {
      // Ajouter
      await addDoc(collection(db, "produits"), {
        name,
        price,
        category,
        available: true
      });
      alert("Produit ajouté.");
    }

    resetForm();
    await loadProducts();
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'enregistrement.");
  }
});

// Réinitialiser le formulaire
function resetForm() {
  isEditing = false;
  inputId.value = "";
  inputName.value = "";
  inputPrice.value = "";
  inputCategory.value = "";
  cancelEditBtn.style.display = "none";
}

cancelEditBtn.addEventListener("click", resetForm);

// Gestion des boutons dans le tableau
productsBody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.getAttribute("data-id");
  const action = btn.getAttribute("data-action");

  if (action === "edit") {
    // Charger les infos dans le formulaire
    const snap = await getDocs(collection(db, "produits"));
    const docSnap = snap.docs.find(d => d.id === id);
    if (!docSnap) return;

    const item = docSnap.data();
    inputId.value = id;
    inputName.value = item.name;
    inputPrice.value = item.price;
    inputCategory.value = item.category || "";

    isEditing = true;
    cancelEditBtn.style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: "smooth" });

  } else if (action === "toggle") {
    // Changer disponible / indisponible
    const snap = await getDocs(collection(db, "produits"));
    const docSnap = snap.docs.find(d => d.id === id);
    if (!docSnap) return;

    const item = docSnap.data();
    await updateDoc(doc(db, "produits", id), {
      available: !item.available
    });
    await loadProducts();

  } else if (action === "delete") {
    if (!confirm("Supprimer ce produit ?")) return;
    await deleteDoc(doc(db, "produits", id));
    await loadProducts();
  }
});

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  cancelEditBtn.style.display = "none";
  loadProducts();
});
