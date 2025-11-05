import { useState, useEffect } from 'react';
import { Settings, Download } from 'lucide-react';
import { supabase, WaterLevel } from '../../lib/supabase';

interface SettingsViewProps {
  waterLevels: WaterLevel[];
}

export function SettingsView({ waterLevels }: SettingsViewProps) {
  const [maxCapacity, setMaxCapacity] = useState(10);
  const [tempCapacity, setTempCapacity] = useState('10');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const savedCapacity = localStorage.getItem('tankMaxCapacity');
    if (savedCapacity) {
      const capacity = parseFloat(savedCapacity);
      setMaxCapacity(capacity);
      setTempCapacity(savedCapacity);
    }
  }, []);

  const handleSaveCapacity = () => {
    const capacity = parseFloat(tempCapacity);
    if (!isNaN(capacity) && capacity > 0) {
      setMaxCapacity(capacity);
      localStorage.setItem('tankMaxCapacity', capacity.toString());
      window.dispatchEvent(new Event('tankCapacityChanged'));
      alert('Capacité maximale enregistrée avec succès');
    }
  };

  const exportToCSV = async () => {
    try {
      let query = supabase.from('water_levels').select('*');

      if (startDate || endDate) {
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        query = query
          .gte('timestamp', start.toISOString())
          .lte('timestamp', end.toISOString());
      }

      const { data, error } = await query.order('timestamp', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        alert('Aucune donnée à exporter');
        return;
      }

      const headers = ['ID', 'Timestamp', 'Volume (m³)', 'Volume (Litres)'];
      const csvRows = [headers.join(',')];

      data.forEach((level: WaterLevel) => {
        const row = [
          level.id,
          level.timestamp,
          level.volume_m3.toFixed(3),
          level.volume_liters.toFixed(2)
        ];
        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `water_levels_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Erreur lors de l\'export CSV');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Paramètres</h2>
        </div>
        <p className="text-sm opacity-90">Configuration du système</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Capacité maximale de la cuve</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Capacité maximale (m³)
            </label>
            <input
              type="number"
              value={tempCapacity}
              onChange={(e) => setTempCapacity(e.target.value)}
              step="0.1"
              min="0.1"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={handleSaveCapacity}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-base font-medium"
          >
            Enregistrer
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Exporter données (CSV)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date de début
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date de fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={exportToCSV}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-base font-medium"
          >
            <Download className="w-5 h-5" />
            Exporter CSV
          </button>
        </div>
      </div>
    </div>
  );
}
