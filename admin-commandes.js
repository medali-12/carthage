import { db } from "./firebase-config.js";
import { 
  getDocs, collection, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
  getAuth, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

async function chargerCommandes() {
  const container = document.getElementById("commandes");

  const snapshot = await getDocs(collection(db, "commandes"));

  container.innerHTML = "";

  snapshot.forEach(docSnap => {
    const c = docSnap.data();
    const id = docSnap.id;

    container.innerHTML += `
      <div class="commande-box">
        <h3>Client : ${c.nom}</h3>
        <p>Table : ${c.table}</p>
        <p>Total : ${c.total} DT</p>
        <p>Date : ${c.date.toDate().toLocaleString()}</p>

        <ul>
          ${c.panier.map(item => `<li>${item.nom} — ${item.prix} DT</li>`).join("")}
        </ul>

        <button class="btn-supprimer" data-id="${id}">
          🗑️ Supprimer
        </button>
      </div>
    `;
  });

  activerSuppression();
}

function activerSuppression() {
  document.querySelectorAll(".btn-supprimer").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      if (confirm("Supprimer cette commande ?")) {
        await deleteDoc(doc(db, "commandes", id));
        chargerCommandes(); // rafraîchir la liste
      }
    });
  });
}

// 🔐 Attendre que l'admin soit connecté avant d'afficher
onAuthStateChanged(auth, user => {
  if (user) {
    chargerCommandes();
  }
});
