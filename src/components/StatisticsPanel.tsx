import { useState, useMemo } from 'react';
import { WaterLevel, AtmosphericCondition } from '../lib/supabase';
import { BarChart3, Filter } from 'lucide-react';

interface StatisticsPanelProps {
  waterLevels: WaterLevel[];
  atmospheric: AtmosphericCondition[];
}

export function StatisticsPanel({ waterLevels, atmospheric }: StatisticsPanelProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterActive, setFilterActive] = useState(false);

  const filteredWaterLevels = useMemo(() => {
    if (!filterActive || (!startDate && !endDate)) return waterLevels;

    return waterLevels.filter((level) => {
      const date = new Date(level.timestamp);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });
  }, [waterLevels, startDate, endDate, filterActive]);

  const filteredAtmospheric = useMemo(() => {
    if (!filterActive || (!startDate && !endDate)) return atmospheric;

    return atmospheric.filter((condition) => {
      const date = new Date(condition.timestamp);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });
  }, [atmospheric, startDate, endDate, filterActive]);

  const statistics = useMemo(() => {
    if (filteredWaterLevels.length < 2) {
      return {
        consumption: 0,
        avgVolume: 0,
        minVolume: 0,
        maxVolume: 0,
        avgTemperature: 0,
        minTemperature: 0,
        maxTemperature: 0,
      };
    }

    const sortedWater = [...filteredWaterLevels].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const firstVolume = sortedWater[0].volume_liters;
    const lastVolume = sortedWater[sortedWater.length - 1].volume_liters;
    const consumption = Math.max(0, firstVolume - lastVolume);

    const volumes = filteredWaterLevels.map((l) => l.volume_liters);
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const minVolume = Math.min(...volumes);
    const maxVolume = Math.max(...volumes);

    let avgTemperature = 0;
    let minTemperature = 0;
    let maxTemperature = 0;

    if (filteredAtmospheric.length > 0) {
      const temperatures = filteredAtmospheric.map((a) => a.temperature);
      avgTemperature = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
      minTemperature = Math.min(...temperatures);
      maxTemperature = Math.max(...temperatures);
    }

    return {
      consumption,
      avgVolume,
      minVolume,
      maxVolume,
      avgTemperature,
      minTemperature,
      maxTemperature,
    };
  }, [filteredWaterLevels, filteredAtmospheric]);

  const handleApplyFilter = () => {
    setFilterActive(true);
  };

  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilterActive(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Statistiques</h3>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrer par période</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="start-date" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Date de début
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="end-date" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Date de fin
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApplyFilter}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Appliquer
          </button>
          <button
            onClick={handleResetFilter}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition"
          >
            Réinitialiser
          </button>
        </div>

        {filterActive && (
          <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            {filteredWaterLevels.length} relevés d'eau, {filteredAtmospheric.length} relevés atmosphériques
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 rounded-lg p-4">
          <h4 className="text-xs font-medium text-red-900 dark:text-red-100 mb-1">Consommation</h4>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">{statistics.consumption.toFixed(2)} L</p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">Sur la période</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
          <h4 className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">Volume Moyen</h4>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{statistics.avgVolume.toFixed(2)} L</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Min: {statistics.minVolume.toFixed(2)} L / Max: {statistics.maxVolume.toFixed(2)} L</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg p-4">
          <h4 className="text-xs font-medium text-orange-900 dark:text-orange-100 mb-1">Température Moyenne</h4>
          <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{statistics.avgTemperature.toFixed(1)}°C</p>
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Min: {statistics.minTemperature.toFixed(1)}°C / Max: {statistics.maxTemperature.toFixed(1)}°C</p>
        </div>
      </div>
    </div>
  );
}
