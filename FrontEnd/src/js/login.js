import { fetchApi } from "./api-service.js";
import { auth } from "./auth-service.js";

console.log(auth.isLoggedIn());

const loginForm = document.getElementById("login-form");

/**
 * Shows the error message element with the given message.
 * @param {string} message The message to display in the error element.
 */
function showError(message) {
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

/**
 * Hides the error message element.
 */
function hideError() {
    const errorElement = document.getElementById("error-message");
    errorElement.style.display = "none";
}

// Use in your login logic
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideError();
    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const response = await fetchApi(
            "/users/login",
            "POST",
            { "Content-Type": "application/json" },
            JSON.stringify({ email, password })
        );
        if (response.token && !response.error) {
            auth.login(response.userID, response.token);
            window.location.href = "index.html";
        } else {
            throw new Error(response.error);
        }
    } catch (error) {
        showError("Email ou mot de passe incorrect");
    }
});
