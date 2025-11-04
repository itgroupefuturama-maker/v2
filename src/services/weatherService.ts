export interface WeatherForecast {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainProbability: number;
  condition: string;
  icon: string;
}

const ANTANANARIVO_FORECAST: WeatherForecast[] = [
  {
    day: 'Lundi',
    date: '4 Nov',
    tempMax: 28,
    tempMin: 22,
    humidity: 68,
    rainProbability: 15,
    condition: 'Ensoleillé',
    icon: 'sunny'
  },
  {
    day: 'Mardi',
    date: '5 Nov',
    tempMax: 27,
    tempMin: 21,
    humidity: 70,
    rainProbability: 25,
    condition: 'Partiellement nuageux',
    icon: 'cloudy'
  },
  {
    day: 'Mercredi',
    date: '6 Nov',
    tempMax: 26,
    tempMin: 20,
    humidity: 72,
    rainProbability: 60,
    condition: 'Pluie probable',
    icon: 'rain'
  },
  {
    day: 'Jeudi',
    date: '7 Nov',
    tempMax: 25,
    tempMin: 19,
    humidity: 75,
    rainProbability: 80,
    condition: 'Pluies',
    icon: 'heavy-rain'
  },
  {
    day: 'Vendredi',
    date: '8 Nov',
    tempMax: 26,
    tempMin: 20,
    humidity: 70,
    rainProbability: 40,
    condition: 'Averses',
    icon: 'rain'
  },
  {
    day: 'Samedi',
    date: '9 Nov',
    tempMax: 28,
    tempMin: 22,
    humidity: 65,
    rainProbability: 20,
    condition: 'Dégageant',
    icon: 'sunny'
  },
  {
    day: 'Dimanche',
    date: '10 Nov',
    tempMax: 29,
    tempMin: 23,
    humidity: 62,
    rainProbability: 10,
    condition: 'Ensoleillé',
    icon: 'sunny'
  }
];

export function getWeekForecast(): WeatherForecast[] {
  return ANTANANARIVO_FORECAST;
}

export function hasRainForecast(days: number = 2): boolean {
  return ANTANANARIVO_FORECAST.slice(0, days).some(f => f.rainProbability >= 50);
}

export function getRainAlerts(): string[] {
  const alerts: string[] = [];
  const highRainDays = ANTANANARIVO_FORECAST.filter(f => f.rainProbability >= 60);

  if (highRainDays.length > 0) {
    alerts.push(`Pluie probable les ${highRainDays.map(d => d.day).join(', ')}`);
  }

  return alerts;
}
