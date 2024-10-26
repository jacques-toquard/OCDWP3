/**
 * Configuration of the application
 * @namespace config
 */
const config = {
    /**
     * The URL of the API
     * @type {string}
     */
    apiUrl: "http://localhost:5678/api",
    /**
     * Gets the token from the local storage
     * @returns {string} The token
     */
    getToken: () => localStorage.getItem("token"),
};

/**
 * Exposes the configuration to the window object
 * @type {config}
 */
window.config = config;
