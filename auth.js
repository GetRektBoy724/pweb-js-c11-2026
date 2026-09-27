// auth.js — Auth Guard, Greeting & Logout for the catalog page (index.html)
// Session key MUST match login.js: "firstName"

"use strict";

const STORAGE_KEY = "firstName";
const LOGIN_PAGE = "login.html";

// ---------- AUTH GUARD ----------
// The catalog page must not be accessible without a session.
(function authGuard() {
  const sessionName = localStorage.getItem(STORAGE_KEY);
  if (!sessionName) {
    window.location.replace(LOGIN_PAGE);
  }
})();

// ---------- GREETING + LOGOUT (replaces the static "Masuk / Daftar") ----------
(function setupAuthUI() {
  // If guard redirected, skip DOM work (page is navigating away)
  const sessionName = localStorage.getItem(STORAGE_KEY);
  if (!sessionName) return;

  const authArea = document.getElementById("authArea");
  if (!authArea) return;

  authArea.innerHTML = "";

  const welcome = document.createElement("span");
  welcome.className = "welcome";
  welcome.textContent = "Halo, " + sessionName + "!";

  const logoutButton = document.createElement("button");
  logoutButton.type = "button";
  logoutButton.id = "logoutButton";
  logoutButton.className = "logout-button";
  logoutButton.textContent = "Keluar";

  logoutButton.addEventListener("click", function () {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = LOGIN_PAGE;
  });

  authArea.appendChild(welcome);
  authArea.appendChild(logoutButton);
})();
