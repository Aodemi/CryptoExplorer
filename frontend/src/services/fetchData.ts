import { api } from "../api/client";
const BASE_URL ="https://api.coingecko.com/api/v3";

export const coingeckoApiLocal = {
    async getCryptos(page = 1, limit = 50) {
        const result = await api.get(`/cryptos?page=${page}&limit=${limit}`);
        if (Array.isArray(result)) {
            return result;
        } else if (result && Array.isArray(result.data)) {
            return result.data;
        } else if (result && result.data && Array.isArray(result.data.data)) {
            return result.data.data;
        }
        return [];
    },

    async searchCrypto(id: string) {
        const result = await api.get(`/cryptos/search/${id}`);
        if (Array.isArray(result)) {
            return result;
        } else if (result && Array.isArray(result.data)) {
            return result.data;
        }

    },

    async getCryptoById(id: string, period = 7) {
        const result = await api.get(`/cryptos/search/${id}`);
        let data = [];
        if (Array.isArray(result)) {
            data = result;
        } else if (result && Array.isArray(result.data)) {
            data = result.data;
        }
 const crypto = data.find((c: any) => 
        c.coingeckoId === id ||  
        c.id === id || 
        c._id === id
    );
            return crypto ;
    },
    async getCryptoAnalysis(id: string, period = 7) {
        return await api.get(`/cryptos/analyse/${id}?period=${period}`);
    },

    async getDashboard() {
        return api.get("/cryptos/dashboard");
    },

    async getFavorites() {
        const result = await api.get("/users/favorites");
        if (result && Array.isArray(result.favorites)) {
            return result.favorites;
        }

        return [];
    },

    async addFavorite(coinId: string) {
        const result = await api.post("/users/favorites", { coinId });

        if (result && Array.isArray(result.favorites)) {
            return result.favorites;
        }

        return [];
    },

    async removeFavorite(coinId: string) {
        const result = await api.delete(`/users/favorites/${coinId}`);

        if (result && Array.isArray(result.favorites)) {
            return result.favorites;
        }

        return [];
    }
};
export const coingeckoApi = {
    async get(vs_currency = "usd", page = 1, per_page = 100) {
        const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=${vs_currency}&page=${page}&per_page=${per_page}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    async getHistoricalData(coinId: string, days = 7) {
        const response = await fetch(`${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    async getCoinDetails(coinId: string) {
        const response = await fetch(`${BASE_URL}/coins/${coinId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
};