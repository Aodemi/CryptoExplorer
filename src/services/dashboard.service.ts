import { getMarkets } from "./coingecko.service";
import { UserModel } from "../models/User";


export async function getUserDashboard(userId: string, vs_currency = "usd") {
    const user = await UserModel.findById(userId);

    if (!user) {
        throw new Error ("Utilisateur introuvable")
    }

    const favorites = user.favorites || [];

    if (favorites.length === 0) {
        return {favorites: [], message: "Aucun crypto suivis."};
    }

    const data = await getMarkets({
        vs_currency,
        ids: favorites.join(","),
        order: "market_cap_desc",
        per_page:favorites.length,
        page: 1,
        price_change_percentage: "24h"
    });

    const dashboard = data.map(c => ({
        id: c.id,
        name: c.name,
        symbol: c.symbol,
        price: c.current_price,
        marketCap: c.market_cap,
        volume: c.total_volume,
        change24h: c.price_change_percentage_24h,
        image: c.image
    }));

    return { favorites: dashboard };
}