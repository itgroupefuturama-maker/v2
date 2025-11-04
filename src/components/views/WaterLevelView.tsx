import { Droplets, Calendar, TrendingDown } from 'lucide-react';
import { WaterLevel } from '../../lib/supabase';

interface WaterLevelViewProps {
  waterLevels: WaterLevel[];
  latestWater: WaterLevel | null;
}

export function WaterLevelView({ waterLevels, latestWater }: WaterLevelViewProps) {
  const calculateAverage = () => {
    if (waterLevels.length === 0) return 0;
    const sum = waterLevels.reduce((acc, level) => acc + level.volume_m3, 0);
    return sum / waterLevels.length;
  };

  const calculateTrend = () => {
    if (waterLevels.length < 2) return 0;
    const recent = waterLevels.slice(0, 5);
    const older = waterLevels.slice(5, 10);

    if (older.length === 0) return 0;

    const recentAvg = recent.reduce((acc, l) => acc + l.volume_m3, 0) / recent.length;
    const olderAvg = older.reduce((acc, l) => acc + l.volume_m3, 0) / older.length;

    return ((recentAvg - olderAvg) / olderAvg) * 100;
  };

  const average = calculateAverage();
  const trend = calculateTrend();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5" />
            <h3 className="text-sm font-medium opacity-90">Volume actuel</h3>
          </div>
          <p className="text-4xl font-bold mb-1">
            {latestWater ? latestWater.volume_m3.toFixed(3) : '---'}
          </p>
          <p className="text-sm opacity-75">m³ ({latestWater ? latestWater.volume_liters.toFixed(0) : '---'} L)</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Volume moyen</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {average.toFixed(3)}
          </p>
          <p className="text-sm text-gray-500">m³</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tendance</h3>
          </div>
          <p className={`text-3xl font-bold mb-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500">vs lectures précédentes</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Historique complet</h3>
        </div>
        <div className="overflow-y-auto max-h-[600px]">
          {waterLevels.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">Aucune donnée disponible</p>
          ) : (
            <div className="space-y-2">
              {waterLevels.map((level, index) => (
                <div
                  key={level.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Droplets className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {level.volume_m3.toFixed(3)} m³
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(level.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {level.volume_liters.toFixed(0)} L
                    </p>
                    {index === 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Plus récent
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
