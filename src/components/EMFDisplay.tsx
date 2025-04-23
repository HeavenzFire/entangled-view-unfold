
import React from 'react';
import { WifiHigh } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

// Simulated EMF data (replace with real sensor data)
const generateEMFData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    emf: Math.random() * 100 + 50,
    frequency: Math.random() * 60 + 20
  }));
};

const EMFDisplay = () => {
  const [emfData, setEmfData] = React.useState(generateEMFData());
  const [currentEMF, setCurrentEMF] = React.useState(75);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setEmfData(prev => [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          emf: Math.random() * 100 + 50,
          frequency: Math.random() * 60 + 20
        }
      ]);
      setCurrentEMF(Math.random() * 100 + 50);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current EMF Reading */}
        <Card className="p-6 bg-gradient-to-br from-purple-100 to-blue-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">EMF Level</h3>
            <WifiHigh className="w-6 h-6 text-purple-600" />
          </div>
          <div className="relative h-32 flex items-center justify-center">
            <div className={`text-4xl font-bold ${currentEMF > 100 ? 'text-red-500' : 'text-purple-600'}`}>
              {currentEMF.toFixed(1)}
              <span className="text-lg ml-1">μT</span>
            </div>
            <div className={`absolute inset-0 rounded-full ${
              currentEMF > 100 ? 'animate-pulse bg-red-500/10' : ''
            }`} />
          </div>
        </Card>

        {/* EMF Frequency Band */}
        <Card className="p-6 bg-gradient-to-br from-blue-100 to-purple-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Frequency Band</h3>
            <div className="text-sm text-gray-600">ELF/VLF</div>
          </div>
          <div className="space-y-4">
            {['3-30 Hz', '30-300 Hz', '300-3000 Hz'].map((band, i) => (
              <div key={band} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{band}</span>
                <div className="w-2/3 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.random() * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* EMF Trend Graph */}
        <Card className="p-6 col-span-1 md:col-span-2 bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">EMF Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emfData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="emf"
                  stroke="#7E69AB"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EMFDisplay;
