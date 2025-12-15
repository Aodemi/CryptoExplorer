import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);
export default function CryptoCompareChart({ comparisonData }: any) {
  return (
    <div style={{ height: '400px' }}>
      <Bar data={comparisonData} />
    </div>
  );
}