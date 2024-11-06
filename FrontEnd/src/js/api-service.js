const apiUrl = "http://localhost:5678/api";

/**
 * @description
 * Fetches API endpoint and returns the parsed JSON response.
 *
 * @param {string} route The API route to fetch.
 * @param {string} [method="GET"] The HTTP method to use.
 * @param {Object} [headers=null] The headers to send with the request.
 * @param {Object} [body=null] The body to send with the request.
 *
 * @returns {Promise<Object>} A Promise that resolves with the parsed JSON response.
 *
 * @throws {Error} If there is an error fetching the API, or if the response is not
 *                 in the 200-299 range, or if the response body is not valid JSON.
 */
export async function fetchApi(route, method = "GET", headers = null, body = null) {
    try {
        const options = {
            method: method,
        };

        if (headers !== null) {
            options.headers = headers;
        }

        if (body !== null) {
            options.body = body;
        }

        const response = await fetch(`${apiUrl}${route}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            throw new Error(
                `Failed to parse JSON response: ${jsonError.message}`
            );
        }
    } catch (error) {
        console.error(`Error while fetching ${apiUrl + route}: ${error}`);
        throw error;
    }
}
