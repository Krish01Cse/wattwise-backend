import { Request, Response } from 'express';
import { EnergyStore } from '../services/store.js';

export class TelemetryController {
  static async getOverview(req: Request, res: Response) {
    try {
      const overview = await EnergyStore.getOverview();
      return res.status(200).json({
        status: 'success',
        data: overview,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to fetch telemetry overview',
      });
    }
  }

  static async getHistory(req: Request, res: Response) {
    try {
      const range = (req.query.range as string) || '7D';
      const history = await EnergyStore.getHistory(range);
      const household = await EnergyStore.getHousehold();

      const totalKwh = Number(history.reduce((sum, h) => sum + h.energyKwh, 0).toFixed(2));
      const totalCost = Number(history.reduce((sum, h) => sum + h.costInr, 0).toFixed(2));
      const avgKwh = Number((totalKwh / history.length).toFixed(2));

      return res.status(200).json({
        status: 'success',
        data: {
          range,
          baselineKwh: 11.4,
          summary: {
            totalKwh,
            totalCostInr: totalCost,
            dailyAverageKwh: avgKwh,
            tariffRateInr: household.baseTariffInr,
          },
          readings: history,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to fetch telemetry history',
      });
    }
  }

  static async getLive(req: Request, res: Response) {
    try {
      // Simulate sub-second real-time instrumentation reading
      const now = new Date();
      const baseWatts = 1850;
      const stochasticJitter = Math.floor(Math.sin(now.getTime() / 2000) * 120 + (Math.random() * 60 - 30));
      const instantaneousWatts = baseWatts + stochasticJitter;
      const voltage = Number((230.4 + (Math.random() * 1.8 - 0.9)).toFixed(1));
      const currentAmps = Number((instantaneousWatts / voltage).toFixed(2));
      const powerFactor = 0.96;
      const frequencyHz = 50.02;

      return res.status(200).json({
        status: 'success',
        data: {
          timestamp: now.toISOString(),
          voltageVolts: voltage,
          currentAmps: currentAmps,
          activePowerWatts: instantaneousWatts,
          frequencyHz: frequencyHz,
          powerFactor: powerFactor,
          compliance: 'IEC 62053-21 Class 1.0',
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to read live telemetry node',
      });
    }
  }

  static async record(req: Request, res: Response) {
    try {
      const { energyKwh, peakPowerWatts, date } = req.body;

      if (energyKwh === undefined || isNaN(Number(energyKwh))) {
        return res.status(400).json({
          status: 'error',
          message: 'Valid energyKwh number is required',
        });
      }

      const recorded = await EnergyStore.recordReading({
        energyKwh: Number(energyKwh),
        peakPowerWatts: peakPowerWatts ? Number(peakPowerWatts) : undefined,
        date,
      });

      return res.status(201).json({
        status: 'success',
        message: 'Telemetry packet successfully ingested into time-series log',
        data: recorded,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to record telemetry reading',
      });
    }
  }
}
