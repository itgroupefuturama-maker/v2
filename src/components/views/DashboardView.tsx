import { Thermometer, TrendingUp, Activity, CloudRain, Power, Droplets } from 'lucide-react';
import { WaterLevel, AtmosphericCondition } from '../../lib/supabase';
import { StatisticsPanel } from '../StatisticsPanel';
import { WaterTankCompact } from '../WaterTankCompact';
import { detectRainAndPump } from '../../lib/statusDetection';

interface DashboardViewProps {
  latestWater: WaterLevel | null;
  latestAtmospheric: AtmosphericCondition | null;
  waterLevels: WaterLevel[];
  atmospheric: AtmosphericCondition[];
  maxCapacity: number;
}

export function DashboardView({ latestWater, latestAtmospheric, waterLevels, atmospheric, maxCapacity }: DashboardViewProps) {
  const status = detectRainAndPump(waterLevels);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Niveau de la cuve</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <WaterTankCompact
                currentVolume={latestWater?.volume_m3 || 0}
                maxCapacity={maxCapacity}
              />
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-center mb-2">
                  <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-300 mr-2" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Volume en m³</p>
                </div>
                <p className="text-4xl font-bold text-blue-700 dark:text-blue-300 my-2">
                  {latestWater ? latestWater.volume_m3.toFixed(3) : '---'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">mètres cubes</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900 dark:to-cyan-800 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Volume en litres</p>
                <p className="text-4xl font-bold text-cyan-700 dark:text-cyan-300 my-2">
                  {latestWater ? (latestWater.volume_m3 * 1000).toFixed(0) : '---'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">litres</p>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Capacité maximale</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{maxCapacity} m³</p>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Capacité libre</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{(maxCapacity - (latestWater?.volume_m3 || 0)).toFixed(3)} m³</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-xl shadow-sm p-6 border transition ${
          status.isRaining
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-700'
            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-lg ${
              status.isRaining ? 'bg-blue-700' : 'bg-blue-100'
            }`}>
              <CloudRain className={`w-6 h-6 ${
                status.isRaining ? 'text-white' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h3 className={`text-sm font-medium ${
                status.isRaining ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'
              }`}>Pluie journalière</h3>
              <p className={`text-2xl font-bold ${
                status.isRaining ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {status.dailyRainfallVolume.toFixed(1)} L
              </p>
            </div>
          </div>
          <div className={`text-xs ${
            status.isRaining ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {status.isRaining ? 'Volume important détecté' : 'Aucune pluie'}
          </div>
        </div>

        <div className={`rounded-xl shadow-sm p-6 border transition ${
          status.isPumpActive
            ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-700'
            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-lg ${
              status.isPumpActive ? 'bg-green-700' : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <Power className={`w-6 h-6 ${
                status.isPumpActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
              }`} />
            </div>
            <div>
              <h3 className={`text-sm font-medium ${
                status.isPumpActive ? 'text-green-100' : 'text-gray-600 dark:text-gray-400'
              }`}>État de la pompe</h3>
              <p className={`text-2xl font-bold ${
                status.isPumpActive ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {status.isPumpActive ? 'EN MARCHE' : 'Arrêtée'}
              </p>
            </div>
          </div>
          <div className={`text-xs ${
            status.isPumpActive ? 'text-green-100' : 'text-gray-500'
          }`}>
            {status.isPumpActive ? '3 diminutions successives' : 'Pas d\'activité'}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
              <Thermometer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Température</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {latestAtmospheric ? `${latestAtmospheric.temperature.toFixed(1)}°C` : '---'}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {latestAtmospheric && new Date(latestAtmospheric.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Humidité</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {latestAtmospheric ? `${latestAtmospheric.humidity.toFixed(1)}%` : '---'}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {latestAtmospheric && new Date(latestAtmospheric.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      <StatisticsPanel waterLevels={waterLevels} atmospheric={atmospheric} />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Résumé d'activité</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">Total de lectures</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{waterLevels.length + atmospheric.length}</p>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-900 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">Lectures d'eau</p>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-300">{waterLevels.length}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">Lectures météo</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-300">{atmospheric.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
