
const products = [
  {id:"sourdough", name:"Classic Sourdough", category:"Fresh Breads", price:"$6–$9"},
  {id:"multigrain", name:"Seeded Multigrain Loaf", category:"Fresh Breads", price:"$7–$10"},
  {id:"cookie", name:"Bakery Cookies", category:"Pastries and Cookies", price:"$2–$4 each"},
  {id:"pastry", name:"Breakfast Pastries", category:"Pastries and Cookies", price:"$3–$6 each"},
  {id:"box", name:"Assorted Pastry Box", category:"Pastries and Cookies", price:"$15–$30"},
  {id:"cake", name:"Simple Celebration Cake", category:"Cakes and Special Orders", price:"$30–$55"},
  {id:"custom", name:"Custom Cake", category:"Cakes and Special Orders", price:"$60 and up"}
];

const categories = ["Fresh Breads", "Pastries and Cookies", "Cakes and Special Orders"];
let favorites = JSON.parse(localStorage.getItem("northStarFavorites") || "[]");

function saveFavorites() {
  localStorage.setItem("northStarFavorites", JSON.stringify(favorites));
}

function renderProducts(filter = "All") {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  const visible = filter === "All" ? products : products.filter(p => p.category === filter);
  grid.innerHTML = visible.map(p => `
    <article class="product-card">
      <p class="small-note">${p.category}</p>
      <h3>${p.name}</h3>
      <p><strong>${p.price}</strong></p>
      <button class="btn favorite-btn ${favorites.includes(p.id) ? "active" : ""}"
        data-id="${p.id}" aria-pressed="${favorites.includes(p.id)}">
        ${favorites.includes(p.id) ? "★ Saved Favorite" : "☆ Add to Favorites"}
      </button>
    </article>`).join("");
  grid.querySelectorAll(".favorite-btn").forEach(btn => btn.addEventListener("click", () => toggleFavorite(btn.dataset.id)));
  updateFavoritePanel();
}

function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
  saveFavorites();
  renderProducts(document.getElementById("categoryFilter")?.value || "All");
}

function updateFavoritePanel() {
  const list = document.getElementById("favoriteList");
  const count = document.getElementById("favoriteCount");
  if (!list || !count) return;
  const chosen = products.filter(p => favorites.includes(p.id));
  count.textContent = chosen.length;
  list.innerHTML = chosen.length ? chosen.map(p => `<li>${p.name} — ${p.price}</li>`).join("") : "<li>No favorites saved yet.</li>";
}

function setupProductFeature() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;
  select.innerHTML = `<option>All</option>` + categories.map(c => `<option>${c}</option>`).join("");
  select.addEventListener("change", () => renderProducts(select.value));
  renderProducts();
}

function setError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function validateForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  let valid = true;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  setError("nameError", "");
  setError("emailError", "");
  setError("messageError", "");

  if (!name) { setError("nameError", "Please enter your name."); valid = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("emailError", "Please enter a valid email address."); valid = false;
  }
  if (message.length < 10) {
    setError("messageError", "Please enter at least 10 characters in your message."); valid = false;
  }

  if (!valid) return;

  localStorage.setItem("northStarCustomer", JSON.stringify({name, email}));
  document.getElementById("formSuccess").textContent = "Thank you! Your message is ready for North Star Bakery.";
  document.getElementById("formSuccess").hidden = false;
}

function loadCustomerInfo() {
  const saved = JSON.parse(localStorage.getItem("northStarCustomer") || "null");
  if (!saved) return;
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  if (name) name.value = saved.name || "";
  if (email) email.value = saved.email || "";
  const note = document.getElementById("remembered");
  if (note) note.textContent = "Saved contact information restored from your previous visit.";
}

document.addEventListener("DOMContentLoaded", () => {
  setupProductFeature();
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", validateForm);
    loadCustomerInfo();
  }
});
