import { db } from "./firebase-config.js";
import { getDocs, collection } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function chargerCommandes() {
  const container = document.getElementById("commandes");

  const snapshot = await getDocs(collection(db, "commandes"));

  container.innerHTML = "";

  snapshot.forEach(doc => {
    const c = doc.data();

    container.innerHTML += `
      <div class="commande-box">
        <h3>Client : ${c.nom}</h3>
        <p>Table : ${c.table}</p>
        <p>Total : ${c.total} DT</p>
        <p>Date : ${c.date.toDate().toLocaleString()}</p>

        <ul>
          ${c.panier.map(item => `<li>${item.nom} — ${item.prix} DT</li>`).join("")}
        </ul>
      </div>
    `;
  });
}

chargerCommandes();
