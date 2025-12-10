import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { coingeckoApi } from '../services/fetchData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CryptoChartProps {
  cryptoName: string;
  cryptoId?: string;
}

export default function CryptoChart({ cryptoName, cryptoId }: CryptoChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (cryptoId) {
      fetchHistoricalData(cryptoId);
    }
  }, [cryptoId]);
  const fetchHistoricalData = async (coinId: string) => { 
    try{
      const fetchedData = await coingeckoApi.getHistoricalData(coinId, 7);
      const labels = fetchedData.prices.map(([timestamp]: [number]) => 
        new Date(timestamp).toLocaleDateString()
      );
      const prices = fetchedData.prices.map(([, price]: [number, number]) => price);

      setChartData({
        labels, 
        datasets: [{
        label: `Prix ${cryptoName}`,
        data: prices,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      }]
      });
    } catch (error) {
      console.error("Erreur lors du chargement des données historiques :", error);
    }};
  const defaultData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: `Prix ${cryptoName}`,
        data: [45000, 46000, 45500, 47000, 46500, 47500, 47200],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Évolution sur 7 jours - ${cryptoName}`
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '400px', marginTop: '20px' }}>
      <Line data={chartData || defaultData} options={options} />
    </div>
  );
}