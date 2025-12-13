import { getMarkets } from "./coingecko.service";


export async function computeSuccessScore() {
    const recent = await getMarkets({
        vs_currency: "usd",
        order: "id_desc",
        per_page: 50,
        page: 1,
        price_change_percentage: "24h"
    });

    if (!recent || recent.length === 0)
        throw new Error("Impossible de récupérer les données.")

    let totalScore = 0;
    recent.forEach(c => {
        let score = 50;

        if (c.price_change_percentage_24h > 0) score +=10;
        if (c.market_cap > 5_000_000) score += 10;
        if (c.total_volume > 1_000_000) score +=10;

        if (c.price_change_percentage_24h < 5 && c.price_change_percentage_24h > -5)
            score += 10;

        totalScore += score
    });

    const avgScore = totalScore / recent.length;

    return {
        score: Math.round(avgScore),
        cryptoAnalysed: recent.length,
        message: avgScore > 70 ? "Probabilité élevée de succès pour les nouvelles cryptos" : avgScore < 50 ? "Probabilité modérée de succès" : "Faible probabilité de succès sur les nouvelles cryptos"
    }
}