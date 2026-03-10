import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // Token simulado o real, inicializado vacío por ahora o desde localStorage
        token: localStorage.getItem('token') || null,
    }),
    actions: {
        setToken(newToken) {
            this.token = newToken;
            localStorage.setItem('token', newToken);
        },
        clearToken() {
            this.token = null;
            localStorage.removeItem('token');
        }
    }
});
