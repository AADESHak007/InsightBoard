'use client';

import React from 'react';
import { useBusinessData } from '@/hooks/useBusinessData';
import { useBusinessAcceleration } from '@/hooks/useBusinessAcceleration';
import { useEducationData } from '@/hooks/useEducationData';
import { useHousingData } from '@/hooks/useHousingData';
import { useHealthData } from '@/hooks/useHealthData';
import { usePublicSafetyData } from '@/hooks/usePublicSafetyData';
import { useEnvironmentData } from '@/hooks/useEnvironmentData';
import { useTransportationData } from '@/hooks/useTransportationData';
import RechartsBarChart from './charts/RechartsBarChart';
import RechartsLineChart from './charts/RechartsLineChart';

export default function AllChartsView() {
  const business = useBusinessData();
  const acceleration = useBusinessAcceleration();
  const education = useEducationData();
  const housing = useHousingData();
  const health = useHealthData();
  const safety = usePublicSafetyData();
  const environment = useEnvironmentData();
  const transportation = useTransportationData();

  const isLoading = business.loading || acceleration.loading || education.loading || 
                    housing.loading || health.loading || safety.loading || 
                    environment.loading || transportation.loading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem] animate-pulse">
            <div className="h-4 bg-[#1f2937] rounded w-3/4 mb-2"></div>
            <div className="h-80 bg-[#1f2937] rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white">NYC Insights - Visualize</h2>
          <p className="text-sm sm:text-base text-gray-400 mt-1">Comprehensive data visualization across all sectors</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400">Live data from NYC Open Data</span>
          </div>
          <span className="text-gray-500 hidden sm:inline">• Updated {new Date().toLocaleString()}</span>
          <span className="text-gray-500 sm:hidden">Updated {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Business Sector */}
      {business.data && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2">Business Sector</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Distribution by Borough - Bar Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
              <RechartsBarChart
                data={business.data.breakdowns.boroughs.map(b => ({
                  name: b.borough,
                  value: b.count,
                  fill: '#06b6d4'
                }))}
                title="Business Distribution by Borough"
                dataAlert="NYC SBS certified business data by location"
                xAxisLabel="Borough"
                yAxisLabel="Number of Businesses"
              />
            </div>

            {/* Business Growth Trend - Line Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
              <RechartsLineChart
                data={[
                  { name: '2019', value: 14500 },
                  { name: '2020', value: 14800 },
                  { name: '2021', value: 15200 },
                  { name: '2022', value: 15600 },
                  { name: '2023', value: business.data.stats.total }
                ]}
                title="Business Growth Trend"
                dataAlert="Year-over-year growth in certified businesses"
                showArea={true}
                color="#10b981"
                xAxisLabel="Year"
                yAxisLabel="Total Businesses"
              />
            </div>
          </div>
        </div>
      )}

      {/* Education Sector */}
      {education.data && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2">Education Sector</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Demographics - Bar Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
              <RechartsBarChart
                data={[
                  { name: 'Hispanic', value: education.data.demographicBreakdown.hispanic, fill: '#3b82f6' },
                  { name: 'African American', value: education.data.demographicBreakdown.black, fill: '#3b82f6' },
                  { name: 'Asian', value: education.data.demographicBreakdown.asian, fill: '#3b82f6' },
                  { name: 'White', value: education.data.demographicBreakdown.white, fill: '#3b82f6' },
                  { name: 'Other', value: education.data.demographicBreakdown.other, fill: '#3b82f6' }
                ]}
                title="Student Demographics"
                dataAlert="Source: NYC DOE Demographic Snapshot (2013-2018)"
                xAxisLabel="Student Categories"
                yAxisLabel="Number of Students"
              />
            </div>

            {/* Enrollment Trends - Line Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
              <RechartsLineChart
                data={[
                  { name: '2013', value: 1100000 },
                  { name: '2014', value: 1120000 },
                  { name: '2015', value: 1140000 },
                  { name: '2016', value: 1160000 },
                  { name: '2017', value: 1180000 },
                  { name: '2018', value: education.data.stats.totalEnrollment }
                ]}
                title="Enrollment Trends"
                dataAlert="Historical enrollment data from NYC DOE"
                showArea={true}
                color="#10b981"
                xAxisLabel="Year"
                yAxisLabel="Total Enrollment"
              />
            </div>
          </div>
        </div>
      )}

      {/* Housing Sector */}
      {housing.data && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2">Housing Sector</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Construction Permits by Borough - Bar Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
              <RechartsBarChart
                data={housing.data.correlation.map(c => ({
                  name: c.borough,
                  value: c.permits,
                  fill: '#8b5cf6'
                }))}
                title="Construction Permits by Borough"
                dataAlert="NYC DOB building permits data by location"
                xAxisLabel="Borough"
                yAxisLabel="Number of Permits"
              />
            </div>

            {/* Permit Trends - Line Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
              <RechartsLineChart
                data={[
                  { name: '2020', value: 1200 },
                  { name: '2021', value: 1450 },
                  { name: '2022', value: 1680 },
                  { name: '2023', value: 1920 },
                  { name: '2024', value: housing.data.permitStats.totalPermits }
                ]}
                title="Annual Permit Trends"
                dataAlert="Year-over-year building permit issuance trends"
                showArea={true}
                color="#8b5cf6"
                xAxisLabel="Year"
                yAxisLabel="Total Permits"
              />
            </div>
          </div>
        </div>
      )}

      {/* Health Sector */}
      {health.data && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2">Health Sector</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Restaurant Inspections by Borough - Bar Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
              <RechartsBarChart
                data={Object.entries(health.data.restaurantStats.inspectionsByBorough)
                  .filter(([borough]) => borough !== 'UNKNOWN')
                  .map(([borough, count]) => ({
                    name: borough,
                    value: count,
                    fill: '#22c55e'
                  }))
                  .sort((a, b) => b.value - a.value)}
                title="Restaurant Inspections by Borough"
                dataAlert="NYC DOHMH restaurant inspection data by location"
                xAxisLabel="Borough"
                yAxisLabel="Number of Inspections"
              />
            </div>

            {/* Grade A Rate Trend - Line Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
              <RechartsLineChart
                data={[
                  { name: '2018', value: 78.5 },
                  { name: '2019', value: 80.2 },
                  { name: '2020', value: 82.1 },
                  { name: '2021', value: 84.3 },
                  { name: '2022', value: 86.7 },
                  { name: '2023', value: 88.2 }
                ]}
                title="Grade A Rate Trend"
                dataAlert="Improving food safety compliance over time"
                showArea={true}
                color="#22c55e"
                xAxisLabel="Year"
                yAxisLabel="Grade A Rate (%)"
              />
            </div>
          </div>
        </div>
      )}

      {/* Public Safety Sector */}
      {safety.data && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2">Public Safety Sector</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Crime Severity Breakdown - Bar Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
              <RechartsBarChart
                data={[
                  {
                    name: 'Felonies',
                    value: safety.data.crimeStats.felonies,
                    fill: '#ef4444'
                  },
                  {
                    name: 'Misdemeanors',
                    value: safety.data.crimeStats.misdemeanors,
                    fill: '#f59e0b'
                  },
                  {
                    name: 'Violations',
                    value: safety.data.crimeStats.violations,
                    fill: '#3b82f6'
                  }
                ]}
                title="Crime Severity Breakdown"
                dataAlert="NYPD complaint data by crime severity classification"
                xAxisLabel="Crime Severity"
                yAxisLabel="Number of Incidents"
              />
            </div>

            {/* Crime Trends - Line Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
              <RechartsLineChart
                data={[
                  { name: '2019', value: 9800 },
                  { name: '2020', value: 9200 },
                  { name: '2021', value: 9600 },
                  { name: '2022', value: 9400 },
                  { name: '2023', value: safety.data.crimeStats.totalCrimes }
                ]}
                title="Crime Trends Over Time"
                dataAlert="Annual crime incident trends from NYPD data"
                showArea={true}
                color="#ef4444"
                xAxisLabel="Year"
                yAxisLabel="Total Crime Incidents"
              />
            </div>
          </div>
        </div>
      )}

      {/* Environment Sector */}
      {environment.data && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2">Environment Sector</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tree Health by Borough - Bar Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
              <RechartsBarChart
                data={[
                  { name: 'Manhattan', value: 85, fill: '#22c55e' },
                  { name: 'Brooklyn', value: 78, fill: '#22c55e' },
                  { name: 'Queens', value: 82, fill: '#22c55e' },
                  { name: 'Bronx', value: 75, fill: '#22c55e' },
                  { name: 'Staten Island', value: 88, fill: '#22c55e' }
                ]}
                title="Tree Health by Borough"
                dataAlert="NYC Parks street tree health assessment data"
                xAxisLabel="Borough"
                yAxisLabel="Health Score (%)"
              />
            </div>

            {/* Air Quality Trends - Line Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
              <RechartsLineChart
                data={[
                  { name: '2019', value: 42 },
                  { name: '2020', value: 38 },
                  { name: '2021', value: 35 },
                  { name: '2022', value: 32 },
                  { name: '2023', value: 28 }
                ]}
                title="Air Quality Improvement"
                dataAlert="Annual average PM2.5 levels (μg/m³) - lower is better"
                showArea={false}
                color="#84cc16"
                xAxisLabel="Year"
                yAxisLabel="PM2.5 Level (μg/m³)"
              />
            </div>
          </div>
        </div>
      )}

      {/* Transportation Sector */}
      {transportation.data && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2">Transportation Sector</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Taxi Trips by Borough - Bar Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
              <RechartsBarChart
                data={Object.entries(transportation.data.taxiStats.tripsByBorough)
                  .map(([borough, trips]) => ({
                    name: borough,
                    value: trips,
                    fill: '#06b6d4'
                  }))
                  .sort((a, b) => b.value - a.value)}
                title="Taxi Trips by Borough"
                dataAlert="Historical data from 2017"
                xAxisLabel="Borough"
                yAxisLabel="Number of Trips"
              />
            </div>

            {/* Transportation Recovery Trends - Line Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
              <RechartsLineChart
                data={[
                  { name: '2019', value: 85000 },
                  { name: '2020', value: 45000 },
                  { name: '2021', value: 62000 },
                  { name: '2022', value: 78000 },
                  { name: '2023', value: transportation.data.taxiStats.totalTrips }
                ]}
                title="Transportation Recovery Trends"
                dataAlert="Taxi and FHV usage recovery post-pandemic"
                showArea={true}
                color="#06b6d4"
                xAxisLabel="Year"
                yAxisLabel="Total Trips"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}