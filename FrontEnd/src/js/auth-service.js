/**
 * Authentication helper
 * @namespace auth
 */
export const auth = {
    /**
     * Sets the user token
     * @param {string} token The user token
     */
    login: (token) => localStorage.setItem("token", token),

    /**
     * Checks if the user is logged in
     * @returns {boolean} True if the user is logged in, false otherwise
     */
    isLoggedIn: () => !!localStorage.getItem("token"),

    /**
     * Gets the user token
     * @returns {string} The user token
     */
    getToken: () => localStorage.getItem("token"),

    /**
     * Logs the user out
     */
    logout: () => localStorage.removeItem("token"),
};
