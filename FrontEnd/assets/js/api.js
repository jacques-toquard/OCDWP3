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
 * Generic fetch function for API calls
 * @template T The expected return type
 * @param {string} route The API route to fetch from
 * @returns {Promise<T>} The parsed JSON response
 * @throws {Error} If the API request fails
 */
async function fetchApi(route) {
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
    return fetchApi("/works");
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
    return fetchApi("/categories");
}
