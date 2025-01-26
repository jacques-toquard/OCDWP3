class ApiService {
  constructor() {
    this.baseUrl = 'http://localhost:5678/api';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: this.headers,
      });
      return await response.json();
    } catch (error) {
      this.handleError(error);
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const apiService = new ApiService();
