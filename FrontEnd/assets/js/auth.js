const auth = {
    isLoggedIn: () => !!window.config.getToken(),
    logout: () => localStorage.removeItem('token')
};

window.auth = auth;