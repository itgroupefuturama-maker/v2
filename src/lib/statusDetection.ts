import { WaterLevel } from './supabase';

export interface SystemStatus {
  isRaining: boolean;
  isPumpActive: boolean;
}

export function detectRainAndPump(waterLevels: WaterLevel[]): SystemStatus {
  const status: SystemStatus = {
    isRaining: false,
    isPumpActive: false,
  };

  if (waterLevels.length < 2) {
    return status;
  }

  const latest = waterLevels[0];
  const previous = waterLevels[1];

  const volumeDiff = latest.volume_liters - previous.volume_liters;
  if (volumeDiff > 10) {
    status.isRaining = true;
  }

  if (waterLevels.length >= 3) {
    const first = waterLevels[0];
    const second = waterLevels[1];
    const third = waterLevels[2];

    const isDecreasing1 = first.volume_liters < second.volume_liters;
    const isDecreasing2 = second.volume_liters < third.volume_liters;

    if (isDecreasing1 && isDecreasing2) {
      status.isPumpActive = true;
    }
  }

  return status;
}
