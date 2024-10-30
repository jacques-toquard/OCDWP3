import { fetchApiPOSTLogin } from "./api.js";

const loginForm = document.getElementById("login-form");

/**
 * Shows an error message in the form
 * @param {string} message - The error message to display
 */
function showError(message) {
    const errorDiv =
        document.getElementById("error-message") ??
        document.createElement("div");

    errorDiv.id = "error-message";
    errorDiv.textContent = message;

    if (!errorDiv.parentNode) {
        loginForm.appendChild(errorDiv);
    }
}

/**
 * Handles the login form submission
 * @param {Event} event - The form submission event
 */
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        const response = await fetchApiPOSTLogin(email, password);
        if (response.token && !response.error) {
            localStorage.setItem("token", response.token);
            window.location.href = "index.html";
        } else if (response.error) {
            showError(response.error);
        } else {
            showError("Erreur inconue");
        }
    } catch (error) {
        showError(error.message);
    }
});
