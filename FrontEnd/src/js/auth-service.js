/**
 * Authentication helper
 * @namespace auth
 */
export const auth = {

    /**
     * Logs the user in
     * @param {string} userID The user ID
     * @param {string} token The user token
     */
    login: (userID, token) => {localStorage.setItem("userID", userID), localStorage.setItem("token", token)},

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
     * Gets the user ID
     * @returns {string} The user ID
     */
    getUserID: () => localStorage.getItem("userID"),

    /**
     * Logs the user out
     */
    logout: () => {localStorage.removeItem("token"), localStorage.removeItem("userID")},
};
