// Login credentials
// const ADMIN_USERNAME = "admin159357";
// const ADMIN_PASSWORD = "admin^^";
const usernamePattern = /^admin\d+$/;
const passwordPattern = /^admin[^A-Za-z0-9]+$/;
const emailPattern = /^admin\d+@[A-Za-z0-9.-]+\.(com|org|net)$/; //*email must contain @ , .com and no spaces ex of valid email: admin123@company.com
const phonePattern = /^\(01\d{2}\)-\d{3}-\d{4}$/; //*phone number must be 10 digits with no spaces or special characters. ex of valid phone number: (0123)-456-7890

// DOM Elements
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

const messageDiv = document.getElementById("message");
const loadingDiv = document.getElementById("loading");

// Login form submit handler
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  // Clear previous messages
  messageDiv.innerHTML = "";
  messageDiv.className = "message";

  // Show loading
  loadingDiv.style.display = "block";
  loginForm.querySelector("button").classList.add("loading");

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Check credentials
  if (
    usernamePattern.test(username) &&
    passwordPattern.test(password) &&
    emailPattern.test(email) &&
    phonePattern.test(phone)
  ) {
    // Admin login successful - THIS IS ONE OF YOUR window.location.href LINES
    messageDiv.innerHTML =
      '<div class="admin-message">Welcome Admin! Redirecting to admin panel...</div>';
    messageDiv.classList.add("admin-message");

    setTimeout(() => {
      window.location.href = "front/index.html"; // ← Admin redirect
    }, 2000);
  } else {
    // Client login - THIS IS THE OTHER window.location.href LINE
    messageDiv.innerHTML =
      '<div class="client-message">Login successful! Redirecting to store...</div>';
    messageDiv.classList.add("client-message");

    setTimeout(() => {
      window.location.href = "client/index.html"; // ← Client redirect
    }, 2000);
  }

  // Hide loading
  loadingDiv.style.display = "none";
  loginForm.querySelector("button").classList.remove("loading");
});

// Add input validation feedback
usernameInput.addEventListener("input", () => {
  if (usernameInput.value.length > 0) {
    usernameInput.classList.add("valid");
  } else {
    usernameInput.classList.remove("valid");
  }
});

passwordInput.addEventListener("input", () => {
  if (passwordInput.value.length > 0) {
    passwordInput.classList.add("valid");
  } else {
    passwordInput.classList.remove("valid");
  }
});

// Add some visual feedback on form focus
loginForm.addEventListener("focusin", () => {
  document.querySelector(".login-form").classList.add("focused");
});

loginForm.addEventListener("focusout", () => {
  document.querySelector(".login-form").classList.remove("focused");
});
