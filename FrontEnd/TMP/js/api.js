/**
 * Validates and gets the API URL from config
 * @returns {string} The API URL
 * @throws {Error} If apiUrl is not properly configured
 */
function getApiUrl() {
    if (!window.config?.apiUrl || typeof window.config.apiUrl !== "string") {
        throw new Error(
            "API URL is not properly configured. Make sure config.js is loaded before api.js"
        );
    }
    return window.config.apiUrl;
}

/**
 * Generic fetch function for GET requests with no headers
 * @template T The expected return type
 * @param {string} route The API route to fetch from
 * @returns {Promise<T>} The parsed JSON response
 * @throws {Error} If the API request fails
 */
async function fetchApiGETnoHeaders(route) {
    const apiUrl = getApiUrl();
    try {
        const response = await fetch(`${apiUrl}${route}`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`API error while fetching ${route}:`, error);
        throw error;
    }
}

/**
 * @typedef {Object} Work
 * @property {number} id
 * @property {string} title
 * @property {number} categoryId
 * @property {string} imageUrl
 */

/**
 * Fetches all works from the API
 * @returns {Promise<Work[]>} The list of works
 * @throws {Error} If the API request fails
 */
export async function getWorks() {
    return fetchApiGETnoHeaders("/works");
}

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 */

/**
 * Fetches categories from the API
 * @returns {Promise<Category[]>} The list of categories
 * @throws {Error} If the API request fails
 */
export async function getCategories() {
    return fetchApiGETnoHeaders("/categories");
}

/**
 * @typedef {Object} LoginResponse
 * @property {string} [token] - The authentication token if login successful
 * @property {string} [error] - Error message if login failed
 */

/**
 * Attempts to log in a user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<LoginResponse>}
 * @throws {Error} if the network request fails
 */
export async function fetchApiPOSTLogin(email, password) {
    const route = "/users/login";
    try {
        const response = await fetch(`${getApiUrl()}${route}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            return { error: "Erreur dans l'identifiant ou le mot de passe" };
        }

        const data = await response.json();
        return { token: data.token };
    } catch (error) {
        console.error("Login request failed:", error);
        throw new Error("Erreur de connexion au serveur");
    }
}

/**
 * Deletes a work by ID
 * @param {number} id - The ID of the work to delete
 * @returns {Promise<void>} - Resolves if the deletion is successful
 * @throws {Error} - If the network request fails
 */
export async function fetchApiDELETEWork(id) {
    const route = `/works/${id}`;
    try {
        const response = await fetch(`${getApiUrl()}${route}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
    } catch (error) {
        console.error(`API error while deleting work ${id}:`, error);
        throw error;
    }
}