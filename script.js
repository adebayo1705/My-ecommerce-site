// ================== GLOBALS ==================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "all"; // Track current category

// ================== DISPLAY PRODUCTS ==================
function displayProducts(filtered = products) {
  const productList = document.getElementById("product-list");
  if (!productList) return;

  productList.innerHTML = filtered.map(p => `
    <div class="product-card" style="background-image: url('${p.img}');">
      <div class="overlay">
        <h4>${p.name}</h4>
        <p class="price">$${p.price}</p>
        <p class="rating">${"⭐".repeat(p.rating)} (${Math.floor(Math.random() * 100) + 10})</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `).join("");
}

// ================== CART FUNCTIONS ==================
function addToCart(id) {
  const item = products.find(p => p.id === id);
  const exist = cart.find(p => p.id === id);
  if (exist) exist.qty++;
  else cart.push({ ...item, qty: 1 });

  saveCart();
  updateCartCount();
  alert("✅ Added to cart!");
}

function displayCart() {
  const cartItems = document.getElementById("cart-items");
  const total = document.getElementById("total");
  if (!cartItems) return;

  let sum = 0;
  cartItems.innerHTML = cart.map(item => {
    sum += item.price * item.qty;
    return `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>$${item.price}</p>
        </div>
        <div class="cart-item-actions">
          <input type="number" min="1" value="${item.qty}" onchange="updateQty(${item.id}, this.value)">
          <button onclick="removeItem(${item.id})">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  if (total) total.textContent = sum.toFixed(2);
  updateCartCount();
}

function updateQty(id, newQty) {
  const item = cart.find(p => p.id === id);
  const qty = parseInt(newQty);
  if (isNaN(qty) || qty < 1) { removeItem(id); return; }
  item.qty = qty;
  saveCart();
  displayCart();
}

function removeItem(id) {
  cart = cart.filter(p => p.id !== id);
  saveCart();
  displayCart();
}

function clearCart() {
  cart = [];
  saveCart();
  displayCart();
}

// ================== LOCAL STORAGE & NAVBAR ==================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCount.textContent = storedCart.reduce((sum, item) => sum + item.qty, 0);
  }
}

// ================== SIDEBAR CATEGORIES ==================
function loadSidebarCategories() {
  const sidebar = document.getElementById("sidebar-categories");
  if (!sidebar) return;

  const categories = ["all", ...new Set(products.map(p => p.category))];
  sidebar.innerHTML = categories.map(cat => `
    <li class="${cat === currentCategory ? "active" : ""}" 
        onclick="filterProducts('${cat}')">
      ${cat === "all" ? "All" : capitalize(cat)}
    </li>
  `).join("");
}

function filterProducts(category) {
  currentCategory = category;
  if (category === "all") displayProducts(products);
  else displayProducts(products.filter(p => p.category === category));

  loadSidebarCategories();
}

// ================== HELPERS ==================
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function toggleMenu() {
  const navMenu = document.getElementById("navMenu");
  const hamburger = document.querySelector(".hamburger");
  if (navMenu) navMenu.classList.toggle("show");
  if (hamburger) hamburger.classList.toggle("active");
}

// ================== HOMEPAGE CATEGORIES & FEATURED ==================
const categoryImages = {
  electronics: "images/electronics.jpg",
  fashion: "images/fashion.jpg",
  home: "images/home.jpg",
  beauty: "images/beauty.jpg",
  sports: "images/sports.jpg"
};



function loadCategories() {
  const grid = document.getElementById("category-grid");
  if (!grid) return;

  const categories = [...new Set(products.map(p => p.category))];
  grid.innerHTML = categories.map(cat => `
    <a href="products.html?category=${cat}" 
       class="product-card category-card"
       style="background-image: url('${categoryImages[cat]}');">
      <h3>${capitalize(cat)}</h3>
    </a>
  `).join("");
}

function loadFeaturedProducts() {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;

  const featured = products.filter(p => p.featured);
  grid.innerHTML = featured.map(product => `
    <div class="product-card" style="background-image: url('${product.img}');">
      <div class="overlay">
        <h4>${product.name}</h4>
        <p>$${product.price}</p>
        <a href="products.html?category=${product.category}">
          <button class="btn-primary">View</button>
        </a>
      </div>
    </div>
  `).join("");
}

// ================== CHECKOUT PAGE ==================
function displayCheckout() {
  const checkoutItems = document.getElementById("checkout-items");
  const checkoutTotal = document.getElementById("checkout-total");
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!checkoutItems || !checkoutTotal) return;

  let sum = 0;
  checkoutItems.innerHTML = storedCart.map(item => {
    sum += item.price * item.qty;
    return `
      <div class="checkout-item">
        <div class="checkout-item-info">
          <img src="${item.img}" alt="${item.name}">
          <span>${item.name} x ${item.qty}</span>
        </div>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `;
  }).join("");

  checkoutTotal.textContent = sum.toFixed(2);
  updateCartCount();
}

// ================== BILLING VALIDATION ==================
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidPhone(phone) {
  const re = /^\d{7,15}$/;
  return re.test(phone);
}

function isValidName(name) {
  const re = /^[a-zA-Z\s']{2,50}$/;
  return re.test(name);
}

function isValidAddress(address) {
  return address.length >= 5;
}

// ================== FORM SUBMISSION ==================
function handleCheckout(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !email || !address || !phone) {
    alert("Please fill in all required fields.");
    return;
  }

  if (!isValidName(name)) { alert("Please enter a valid name."); return; }
  if (!isValidEmail(email)) { alert("Please enter a valid email."); return; }
  if (!isValidAddress(address)) { alert("Please enter a valid address."); return; }
  if (!isValidPhone(phone)) { alert("Please enter a valid phone number."); return; }

  alert(`Thank you, ${name}! Your order has been placed.`);
  localStorage.removeItem("cart");
  updateCartCount();
  window.location.href = "index.html";
}

// ================== PAYSTACK PAYMENT ==================
function setupPaystack() {
  const payNowBtn = document.getElementById("pay-now");
  if (!payNowBtn) return;

  payNowBtn.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !email || !address || !phone) {
      alert("Please fill in all billing details before proceeding to payment.");
      return;
    }

    if (!isValidName(name)) { alert("Please enter a valid name."); return; }
    if (!isValidEmail(email)) { alert("Please enter a valid email."); return; }
    if (!isValidAddress(address)) { alert("Please enter a valid address."); return; }
    if (!isValidPhone(phone)) { alert("Please enter a valid phone number."); return; }

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const totalAmount = storedCart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const handler = PaystackPop.setup({
      key: "pk_test_3345810ed4ae93a710dc2acafe1e121db13910f4", // Test key
      email: email,
      amount: totalAmount * 100, // kobo
      currency: "NGN", // Change to "USD" if multi-currency enabled
      onClose: () => alert("Payment window closed."),
      callback: (response) => {
        alert("✅ Payment successful! Reference: " + response.reference);
        localStorage.removeItem("cart");
        updateCartCount();
        window.location.href = "index.html";
      }
    });

    handler.openIframe();
  });
}

// ================== PAGE LOAD ==================
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const urlCategory = params.get("category");
  if (urlCategory && products.some(p => p.category === urlCategory)) {
    currentCategory = urlCategory;
  }

  filterProducts(currentCategory);
  loadSidebarCategories();

  if (document.getElementById("category-grid")) loadCategories();
  if (document.getElementById("featured-grid")) loadFeaturedProducts();
  if (document.getElementById("cart-items")) displayCart();
  if (document.getElementById("checkout-items")) displayCheckout();
  setupPaystack();

  updateCartCount();
});
