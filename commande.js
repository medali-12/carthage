// Charger le panier depuis le stockage local
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.querySelector(".cart-items");
const totalEl = document.querySelector(".cart-total-value");

let total = 0;

// Afficher les articles du panier
cart.forEach(item => {
  container.innerHTML += `
    <div class="cart-line">
      <span>${item.nom}</span>
      <span>${item.prix} DT</span>
    </div>
  `;
  total += item.prix;
});

// Afficher le total
totalEl.textContent = total.toFixed(3) + " DT";
