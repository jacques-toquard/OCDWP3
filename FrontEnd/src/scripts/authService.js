/**
 * Service for handling authentication.
 */
export const authService = {
  /**
   * Logs a user in.
   * @param {string} userID - The user's ID.
   * @param {string} token - The authentication token.
   */
  login: (userID, token) => {
    localStorage.setItem('userID', userID);
    localStorage.setItem('token', token);
  },

  /**
   * Checks if a user is logged in.
   * @returns {boolean} Whether a user is logged in.
   */
  isLoggedIn: () => !!localStorage.getItem('token'),

  /**
   * Gets the authentication token.
   * @returns {string|null} The authentication token.
   */
  getToken: () => localStorage.getItem('token'),

  /**
   * Gets the user's ID.
   * @returns {string|null} The user's ID.
   */
  getUserID: () => localStorage.getItem('userID'),

  /**
   * Logs a user out.
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
  },
};
