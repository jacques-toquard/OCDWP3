import { authService } from './authService.js';

/**
 * Service for interacting with the API.
 */
class ApiService {
  /**
   * @param {string} [baseUrl=http://localhost:5678/api] - The base URL of the API.
   */
  constructor(baseUrl = 'http://localhost:5678/api') {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
    };
    if (authService.getToken()) {
      this.headers.Authorization = `Bearer ${authService.getToken()}`;
    }
  }

  /**
   * Makes a GET request to the API.
   * @param {string} endpoint - The endpoint to request.
   * @returns {Promise<null|Object>} The response data.
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: this.headers,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      try {
        const data = await response.json();
        return data;
      } catch {
        return null;
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Makes a POST request to the API.
   * @param {string} endpoint - The endpoint to request.
   * @param {Object} data - The data to send in the request body.
   * @returns {Promise<null|Object>} The response data.
   */
  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      try {
        const data = await response.json();
        return data;
      } catch {
        return null;
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.headers,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      try {
        const data = await response.json();
        return data;
      } catch {
        return null;
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Handles an error that occurred while making a request to the API.
   * @param {Error} error - The error that occurred.
   */
  handleError(error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * The singleton instance of the ApiService.
 */
const apiService = new ApiService();

export { apiService };
