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
 * Logs in a user and returns a JSON Web Token
 * @param {string} email The user's email
 * @param {string} password The user's password
 * @returns {Promise<{token: string}>} The JSON Web Token
 * @throws {Error} If the API request fails
 */
export async function fetchApiPOSTLogin(email, password) {
    const route = "/users/login";
    try {
        const response = await fetch(`${getApiUrl()}${route}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`API error while fetching ${route}:`, error);
        throw error;
    }
}
