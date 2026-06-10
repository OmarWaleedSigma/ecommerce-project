const API_URL = "http://localhost:3000";

// DOM Elements
const detailsView = document.getElementById("details-view");

// Parse product ID from URL query parameters
const getProductIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
};

// Fetch product details
const fetchProductDetails = async () => {
  const productId = getProductIdFromUrl();
  if (!productId) {
    detailsView.innerHTML = `<div class="loader-spinner" style="color: red;">Error: No product ID specified in URL.</div>`;
    return;
  }

  try {
    const response = await fetch(`${API_URL}/products/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product details (Status: ${response.status})`);
    }
    const product = await response.json();
    renderProductDetails(product);
  } catch (error) {
    console.error(error);
    detailsView.innerHTML = `
      <div class="loader-spinner" style="color: red;">
        Error loading product details. Ensure the backend server is running.
      </div>
    `;
  }
};

// Render details to UI
const renderProductDetails = (product) => {
  detailsView.innerHTML = `
    <div class="details-container">
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.title}" onerror="this.src='https://placehold.co/400x400?text=No+Image'">
      </div>
      <div class="product-info">
        <span class="product-cat">${product.category}</span>
        <h2 class="product-name">${product.title}</h2>
        <div class="product-price-tag">$${Number(product.price).toFixed(2)}</div>
        
        <h3 class="product-desc-title">Description</h3>
        <p class="product-desc">${product.description}</p>
        
        <div class="action-buttons">
          <button class="btn btn-primary" onclick="addToCartAndGoBack('${product.id}')" style="padding: 12px 24px;">
            🛒 Add to Cart & Return
          </button>
        </div>
      </div>
    </div>
  `;
};

// Add to Cart helper (uses standard API endpoints)
const addToCartAndGoBack = async (productId) => {
  try {
    // Fetch product details
    const prodRes = await fetch(`${API_URL}/products/${productId}`);
    const cartRes = await fetch(`${API_URL}/cart`);
    
    if (!prodRes.ok || !cartRes.ok) {
      throw new Error("Failed to communicate with store database.");
    }
    
    const product = await prodRes.json();
    const cartItems = await cartRes.json();
    
    const existingItem = cartItems.find((item) => item.title === product.title);
    if (existingItem) {
      // Update quantity
      await fetch(`${API_URL}/cart/${existingItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: existingItem.quantity + 1 })
      });
    } else {
      // Add new
      await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, quantity: 1 })
      });
    }
    
    alert("Product added to cart!");
    window.history.back();
  } catch (error) {
    console.error("Error adding to cart:", error);
    // alert("Error adding product to cart.");
  }
};

// History back button handler
const goBack = () => {
  window.history.back();
};

// Quick preview button handler
// Dynamic popup close button inside pop-up store window
if (window.opener) {
  const closeBtn = document.createElement("button");
  closeBtn.id = "popup-close-btn";
  closeBtn.className = "btn btn-danger";
  closeBtn.innerHTML = "❌ Close Preview";
  closeBtn.style.position = "fixed";
  closeBtn.style.bottom = "20px";
  closeBtn.style.right = "20px";
  closeBtn.style.width = "auto";
  closeBtn.style.zIndex = "9999";
  closeBtn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
  closeBtn.style.padding = "12px 24px";
  closeBtn.style.borderRadius = "30px";
  closeBtn.style.fontSize = "14px";
  closeBtn.style.fontWeight = "bold";
  closeBtn.style.border = "none";
  closeBtn.style.cursor = "pointer";
  
  closeBtn.onclick = () => {
    window.close();
  };
  
  document.body.appendChild(closeBtn);
}

// Initial Load
fetchProductDetails();