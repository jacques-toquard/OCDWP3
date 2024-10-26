const config = {
    apiUrl: 'https://api.example.com',
    getToken: () => localStorage.getItem('token')
};

window.config = config;