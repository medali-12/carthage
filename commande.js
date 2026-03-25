// Charger le panier depuis localStorage
function chargerPanier() {
  let panier = JSON.parse(localStorage.getItem("panier")) || [];

  const panierDiv = document.getElementById("panier");
  const totalDiv = document.getElementById("total");

  panierDiv.innerHTML = "";
  let total = 0;

  panier.forEach(item => {
    panierDiv.innerHTML += `
      <p>${item.nom} — ${item.prix} DT</p>
    `;
    total += item.prix;
  });

  totalDiv.textContent = total.toFixed(3) + " DT";
}

// Envoyer la commande
document.getElementById("envoyer").addEventListener("click", async () => {
  let panier = JSON.parse(localStorage.getItem("panier")) || [];

  const nom = document.getElementById("nom").value;
  const table = document.getElementById("table").value;

  if (!nom || !table || panier.length === 0) {
    alert("Veuillez remplir tous les champs et ajouter des produits.");
    return;
  }

  await addDoc(collection(db, "commandes"), {
    nom,
    table,
    panier,
    total: panier.reduce((t, p) => t + p.prix, 0),
    date: Timestamp.now()
  });

  alert("Commande envoyée !");
  localStorage.removeItem("panier");
  chargerPanier();
});

// Charger au démarrage
chargerPanier();
