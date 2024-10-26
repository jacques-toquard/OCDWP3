/**
 * Authentication helper
 * @namespace auth
 */
const auth = {
    /**
     * Checks if the user is logged in
     * @returns {boolean} True if the user is logged in, false otherwise
     */
    isLoggedIn: () => !!window.config.getToken(),
    /**
     * Logs the user out
     */
    logout: () => localStorage.removeItem("token"),
};

/**
 * Exposes the authentication helper to the window object
 * @type {auth}
 */
window.auth = auth;
