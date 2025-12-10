
const API_BASE_URL = "https://api.coingecko.com/api/v3";

export const coingeckoApi = {
    async get(vs_currency = "usd", page = 1, per_page = 100) {
        const response = await fetch(`${API_BASE_URL}/coins/markets?vs_currency=${vs_currency}&page=${page}&per_page=${per_page}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    async getHistoricalData(coinId: string, days = 7) {
        const response = await fetch(`${API_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    async getCoinDetails(coinId: string) {
        const response = await fetch(`${API_BASE_URL}/coins/${coinId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
};