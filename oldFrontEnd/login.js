const apiUrl = 'http://localhost:5678/api'
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Récupération des valeurs du formulaire
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    
    try {
        // Envoi de la requête POST au serveur
        const response = await fetch(`${apiUrl}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        // Traitement de la réponse
        if (response.ok) {
            const data = await response.json();
            
            // Stockage du token dans le localStorage
            localStorage.setItem('token', data.token);
            
            // Redirection vers la page d'accueil
            window.location.href = 'index.html';
        } else {
            // En cas d'erreur d'authentification
            showError('Erreur dans l\'identifiant ou le mot de passe');
        }
    } catch (error) {
        showError('Une erreur est survenue, veuillez réessayer plus tard');
    }
});

// Fonction pour afficher les messages d'erreur
function showError(message) {
    // Suppression d'un message d'erreur précédent s'il existe
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Création et affichage du message d'erreur
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'red';
    errorDiv.style.marginTop = '10px';
    errorDiv.style.textAlign = 'center';
    errorDiv.textContent = message;
    
    loginForm.appendChild(errorDiv);
}