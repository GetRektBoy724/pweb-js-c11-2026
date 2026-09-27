// login.js — Authentication & Login (OrangeMart)
// Validates credentials against https://dummyjson.com/users

"use strict";

const USERS_API = "https://dummyjson.com/users";
const STORAGE_KEY = "firstName";
const CATALOG_PAGE = "index.html";

// ---------- DOM refs ----------
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const loginError = document.getElementById("loginError");
const togglePassword = document.getElementById("togglePassword");

// ---------- Utility: show / clear error message ----------
function showError(message) {
  loginError.textContent = message;
  loginError.hidden = false;
}

function clearError() {
  loginError.textContent = "";
  loginError.hidden = true;
}

// ---------- Utility: loading state ----------
function setLoading(isLoading) {
  loginButton.disabled = isLoading;
  loginButton.classList.toggle("is-loading", isLoading);
  loginButton.textContent = isLoading ? "MEMPROSES..." : "MASUK";
  usernameInput.disabled = isLoading;
  passwordInput.disabled = isLoading;
}

// ---------- Bonus: password visibility toggle ----------
togglePassword.addEventListener("click", function () {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.textContent = isHidden ? "🙈" : "👁";
  togglePassword.setAttribute(
    "aria-label",
    isHidden ? "Sembunyikan password" : "Tampilkan password"
  );
});

// ---------- Bonus: already logged in? skip login page ----------
(function redirectIfLoggedIn() {
  const savedName = localStorage.getItem(STORAGE_KEY);
  if (savedName) {
    window.location.replace(CATALOG_PAGE);
  }
})();

// ---------- Main login flow ----------
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // stay on page, verify via API first
  clearError();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  // Client-side validation: no API call for empty fields
  if (username === "" || password === "") {
    showError("Username dan password wajib diisi.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(USERS_API);

    if (!response.ok) {
      throw new Error("Server merespons dengan status " + response.status);
    }

    const data = await response.json();
    const users = data.users || [];

    // Find user whose username AND password both match
    const matchedUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (!matchedUser) {
      // Wrong credentials (distinct from connection failure)
      showError("Username atau password salah. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    // SUCCESS — persist session
    localStorage.setItem(STORAGE_KEY, matchedUser.firstName);
    setLoading(false);
    window.location.href = CATALOG_PAGE;

  } catch (error) {
    // Network / API failure (distinct from wrong credentials)
    console.error("Login error:", error);
    showError(
      "Koneksi ke server bermasalah. Periksa koneksi internet Anda lalu coba lagi."
    );
    setLoading(false);
  }
});
