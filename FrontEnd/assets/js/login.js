import { fetchApiPOSTLogin } from "./api.js";

const loginForm = document.getElementById("login-form");

function showError(message) {
    const existingError = document.querySelector(".error-message");
    if (existingError) {
        existingError.remove();
    }
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.color = "red";
    errorDiv.style.marginTop = "10px";
    errorDiv.style.textAlign = "center";
    errorDiv.textContent = message;
    loginForm.appendChild(errorDiv);
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Récupération des valeurs du formulaire
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
        const data = await fetchApiPOSTLogin(email, password);

        if (data.token && response.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } else if (!data.token || !response.ok) {
            showError("Erreur dans l'identifiant ou le mot de passe");
        }
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
    }
});
