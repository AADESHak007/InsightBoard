import { Category, Trend, TargetCondition } from '@prisma/client';
import {
  fetchAirQuality,
  fetchStreetTrees,
  fetchGHGEmissions,
  fetchDSNYTonnage,
  calculateAirQualityStats,
  calculateTreeStats,
  calculateGHGEmissionsStats,
  calculateRecyclingDiversionStats,
  getPM25YearlyTrend,
  type AirQualityRecord,
  type StreetTree,
  type GHGEmissionsRecord,
  type DSNYTonnageRecord,
} from '@/lib/api/environmentData';

export async function fetchEnvironmentData(limit: number = 10000) {
  const [airQuality, trees, ghgEmissions, dsnyTonnage] = await Promise.all([
    fetchAirQuality(limit),
    fetchStreetTrees(limit),
    fetchGHGEmissions(limit),
    fetchDSNYTonnage(limit),
  ]);

  return { airQuality, trees, ghgEmissions, dsnyTonnage };
}

export function calculateEnvironmentStats(rawData: { 
  airQuality: AirQualityRecord[]; 
  trees: StreetTree[]; 
  ghgEmissions: GHGEmissionsRecord[]; 
  dsnyTonnage: DSNYTonnageRecord[] 
}) {
  const { airQuality, trees, ghgEmissions, dsnyTonnage } = rawData;

  // Calculate statistics
  const airQualityStats = calculateAirQualityStats(airQuality);
  const treeStats = calculateTreeStats(trees);
  const ghgEmissionsStats = calculateGHGEmissionsStats(ghgEmissions);
  const recyclingDiversionStats = calculateRecyclingDiversionStats(dsnyTonnage);
  const pm25YearlyTrend = getPM25YearlyTrend(airQuality);

  // Convert to indicator format
  const indicators = [
    {
      title: 'Average PM2.5 Level',
      category: 'ENVIRONMENT' as Category,
      description: 'Average PM2.5 air quality measurement across NYC.',
      value: airQualityStats.avgPM25,
      unit: 'μg/m³',
      target: 12,
      targetCondition: 'LESS_THAN_OR_EQUAL' as TargetCondition,
      lastUpdate: new Date(),
      source: 'NYC DEP',
      trend: airQualityStats.avgPM25 <= 12 ? 'DOWN' as Trend : 'UP' as Trend,
      color: '#10b981',
      higherIsBetter: false,
      explanation: 'Lower PM2.5 levels indicate better air quality and reduced health risks.',
      chartData: pm25YearlyTrend.map(point => ({
        year: parseInt(point.year),
        value: point.pm25
      }))
    },
    {
      title: 'Average NO2 Level',
      category: 'ENVIRONMENT' as Category,
      description: 'Average nitrogen dioxide concentration across NYC.',
      value: airQualityStats.avgNO2,
      unit: 'ppb',
      target: 15,
      targetCondition: 'LESS_THAN_OR_EQUAL' as TargetCondition,
      lastUpdate: new Date(),
      source: 'NYC DEP',
      trend: airQualityStats.avgNO2 <= 15 ? 'DOWN' as Trend : 'UP' as Trend,
      color: '#3b82f6',
      higherIsBetter: false,
      explanation: 'Toxic gas primarily from vehicle emissions and power plants. Lower concentrations indicate better air quality and reduced asthma triggers.',
      chartData: []
    },
    {
      title: 'Average O3 Level',
      category: 'ENVIRONMENT' as Category,
      description: 'Average ground-level ozone concentration across NYC.',
      value: airQualityStats.avgOzone,
      unit: 'ppb',
      target: 35,
      targetCondition: 'LESS_THAN_OR_EQUAL' as TargetCondition,
      lastUpdate: new Date(),
      source: 'NYC DEP',
      trend: airQualityStats.avgOzone <= 35 ? 'DOWN' as Trend : 'UP' as Trend,
      color: '#06b6d4',
      higherIsBetter: false,
      explanation: 'Harmful pollutant formed by sunlight and emissions. Lower levels mean healthier air, especially for vulnerable populations.',
      chartData: []
    },
    {
      title: 'Total Street Trees',
      category: 'ENVIRONMENT' as Category,
      description: 'Total number of street trees in NYC.',
      value: treeStats.totalTrees,
      unit: 'trees',
      target: 1000000,
      targetCondition: 'GREATER_THAN_OR_EQUAL' as TargetCondition,
      lastUpdate: new Date(),
      source: 'NYC Parks',
      trend: 'UP' as Trend,
      color: '#10b981',
      higherIsBetter: true,
      explanation: 'More trees improve air quality, reduce urban heat, and enhance quality of life.',
      chartData: [] // Add tree growth trend data if available
    },
    {
      title: 'GHG Emissions Reduction',
      category: 'ENVIRONMENT' as Category,
      description: 'Percentage reduction in greenhouse gas emissions since 2005.',
      value: ghgEmissionsStats.reductionPercent,
      unit: '%',
      target: 40,
      targetCondition: 'GREATER_THAN_OR_EQUAL' as TargetCondition,
      lastUpdate: new Date(),
      source: 'NYC Mayor\'s Office',
      trend: ghgEmissionsStats.reductionPercent >= 40 ? 'UP' as Trend : 'STABLE' as Trend,
      color: '#10b981',
      higherIsBetter: true,
      explanation: 'Higher reduction percentages indicate progress toward climate goals.',
      chartData: ghgEmissionsStats.yearlyTrend.map(point => ({
        year: parseInt(point.year),
        value: point.emissions
      }))
    },
    {
      title: 'Waste Diversion Rate',
      category: 'ENVIRONMENT' as Category,
      description: 'Percentage of waste diverted from landfills through recycling and composting.',
      value: recyclingDiversionStats.currentDiversionRate,
      unit: '%',
      target: 30,
      targetCondition: 'GREATER_THAN_OR_EQUAL' as TargetCondition,
      lastUpdate: new Date(),
      source: 'NYC DSNY',
      trend: recyclingDiversionStats.currentDiversionRate >= 30 ? 'UP' as Trend : 'STABLE' as Trend,
      color: '#10b981',
      higherIsBetter: true,
      explanation: 'Higher diversion rates indicate better waste management and environmental sustainability.',
      chartData: recyclingDiversionStats.yearlyTrend.map(point => ({
        year: parseInt(point.year),
        value: point.diversionRate
      }))
    }
  ];

  return indicators;
}
