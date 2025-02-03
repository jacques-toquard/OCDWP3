import { authService } from './authService.js';
import { apiService } from './apiService.js';

/**
 * Checks if the user is logged in and logs the result to the console.
 */
console.log(authService.isLoggedIn());

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

/**
 * Handles error messages for the login process.
 * @type {Object}
 * @property {HTMLElement} element - The element to display the error message.
 * @property {function} show - Displays the error message.
 */
const errorHandler = {
  element: document.getElementById('errorMessage'),
  show: function (message) {
    this.element.style.display = 'block';
    this.element.textContent = message;
  },
};

/**
 * Event listener for the login form submission.
 * @param {Event} event - The submit event.
 */
loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  try {
    const response = await apiService.post('/users/login', {
      email: emailInput.value,
      password: passwordInput.value,
    });
    authService.login(response.userId, response.token);
    window.location.href = './index.html';
  } catch {
    errorHandler.show(
      'Une erreur est survenue, veuillez vérifier vos informations'
    );
  }
});
