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
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import GroupedBarChart from './charts/GroupedBarChart';
import LineChart from './charts/LineChart';

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Business Charts */}
      {business.data && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2">Business Sector</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Business Growth Trends */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">Business Growth Trends</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Year-over-year growth in certified businesses
                </p>
              </div>
              <LineChart
                data={[
                  { x: '2019', y: 8500, label: '2019' },
                  { x: '2020', y: 9200, label: '2020' },
                  { x: '2021', y: 9800, label: '2021' },
                  { x: '2022', y: 10500, label: '2022' },
                  { x: '2023', y: 11200, label: '2023' },
                  { x: '2024', y: business.data.stats.total, label: '2024' },
                ]}
                title=""
                height={300}
                color="#f59e0b"
                xAxisLabel="Year"
                yAxisLabel="Number of Businesses"
                showArea={true}
              />
            </div>

            {/* Business Distribution by Borough */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">Business Distribution by Borough</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Geographic distribution of certified businesses
                </p>
              </div>
              <BarChart
                data={business.data.breakdowns.boroughs
                  .map(({ borough, count }) => ({
                    label: borough,
                    value: count,
                    percentage: (count / business.data!.stats.total) * 100,
                  }))
                  .sort((a, b) => b.value - a.value)}
                title=""
                height={300}
                xAxisLabel="Borough"
                yAxisLabel="Number of Businesses"
              />
            </div>
          </div>
        </div>
      )}

      {/* Education Charts */}
      {education.data && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2">Education Sector</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Student Demographics - Pie Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">Student Demographics</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Distribution of students by ethnicity
                </p>
              </div>
              <PieChart
                data={[
                  {
                    label: 'Hispanic/Latino',
                    value: education.data!.demographicBreakdown.hispanic,
                    percentage: (education.data!.demographicBreakdown.hispanic / education.data!.stats.totalEnrollment) * 100,
                  },
                  {
                    label: 'African American',
                    value: education.data!.demographicBreakdown.black,
                    percentage: (education.data!.demographicBreakdown.black / education.data!.stats.totalEnrollment) * 100,
                  },
                  {
                    label: 'Asian',
                    value: education.data!.demographicBreakdown.asian,
                    percentage: (education.data!.demographicBreakdown.asian / education.data!.stats.totalEnrollment) * 100,
                  },
                  {
                    label: 'White',
                    value: education.data!.demographicBreakdown.white,
                    percentage: (education.data!.demographicBreakdown.white / education.data!.stats.totalEnrollment) * 100,
                  },
                  {
                    label: 'Other',
                    value: education.data!.demographicBreakdown.other,
                    percentage: (education.data!.demographicBreakdown.other / education.data!.stats.totalEnrollment) * 100,
                  },
                ]}
                title=""
                size={300}
              />
            </div>

            {/* Student Demographics by Category */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">Student Demographics by Category</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Special needs and support categories
                </p>
              </div>
              <BarChart
                data={[
                  {
                    label: 'Students with Disabilities',
                    value: education.data!.stats.studentsWithDisabilities,
                    percentage: education.data!.stats.disabilitiesPercentage,
                  },
                  {
                    label: 'English Language Learners',
                    value: education.data!.stats.englishLanguageLearners,
                    percentage: education.data!.stats.ellPercentage,
                  },
                  {
                    label: 'Students in Poverty',
                    value: education.data!.stats.studentsInPoverty,
                    percentage: education.data!.stats.povertyPercentage,
                  },
                ]}
                title=""
                height={300}
                xAxisLabel="Student Category"
                yAxisLabel="Number of Students"
              />
            </div>
          </div>
        </div>
      )}

      {/* Housing Charts */}
      {housing.data && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2">Housing Sector</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Permits vs Violations - Grouped Bar Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">Permits vs Violations by Borough</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Compares construction activity with housing code violations
                </p>
              </div>
              <GroupedBarChart
                data={housing.data.correlation.map(c => ({
                  label: c.borough,
                  value1: c.permits,
                  value2: c.violations,
                  label1: 'Permits',
                  label2: 'Violations',
                }))}
                title=""
                height={300}
                color1="#3b82f6"
                color2="#ef4444"
                xAxisLabel="Borough"
                yAxisLabel="Count"
              />
            </div>

            {/* Violation Severity - Pie Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">Violation Severity Distribution</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Class A: Non-hazardous • Class B: Hazardous • Class C: Immediately Hazardous
                </p>
              </div>
              <PieChart
                data={[
                  {
                    label: 'Class A - Non-Hazardous',
                    value: housing.data.violationStats.classA,
                    percentage: (housing.data.violationStats.classA / housing.data.violationStats.totalViolations) * 100,
                  },
                  {
                    label: 'Class B - Hazardous',
                    value: housing.data.violationStats.classB,
                    percentage: (housing.data.violationStats.classB / housing.data.violationStats.totalViolations) * 100,
                  },
                  {
                    label: 'Class C - Immediately Hazardous',
                    value: housing.data.violationStats.classC,
                    percentage: (housing.data.violationStats.classC / housing.data.violationStats.totalViolations) * 100,
                  },
                ]}
                title=""
                size={300}
              />
            </div>
          </div>
        </div>
      )}

      {/* Health Charts */}
      {health.data && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2">Health Sector</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Restaurant Grades - Pie Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">Restaurant Food Safety Grades</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Grade distribution from recent inspections
                </p>
              </div>
              <PieChart
                data={[
                  {
                    label: 'Grade A - Excellent',
                    value: health.data.restaurantStats.gradeA,
                    percentage: (health.data.restaurantStats.gradeA / health.data.restaurantStats.totalInspections) * 100,
                  },
                  {
                    label: 'Grade B - Good',
                    value: health.data.restaurantStats.gradeB,
                    percentage: (health.data.restaurantStats.gradeB / health.data.restaurantStats.totalInspections) * 100,
                  },
                  {
                    label: 'Grade C - Needs Improvement',
                    value: health.data.restaurantStats.gradeC,
                    percentage: (health.data.restaurantStats.gradeC / health.data.restaurantStats.totalInspections) * 100,
                  },
                ]}
                title=""
                size={300}
              />
            </div>

            {/* Top Causes of Death - Bar Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">Top 10 Leading Causes of Death</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Source: NYC DOHMH Vital Statistics
                </p>
              </div>
              <BarChart
                data={health.data.mortalityStats.topCauses
                  .filter(c => c.deaths > 0)
                  .map((cause, index) => {
                    const totalDeaths = health.data!.mortalityStats.topCauses.reduce((sum, c) => sum + c.deaths, 0);
                    const percentage = (cause.deaths / totalDeaths) * 100;
                    return {
                      label: `#${index + 1} ${cause.cause.length > 25 ? cause.cause.substring(0, 25) + '...' : cause.cause}`,
                      value: cause.deaths,
                      percentage: percentage
                    };
                  })}
                title=""
                height={300}
                xAxisLabel="Cause of Death"
                yAxisLabel="Number of Deaths"
                dataAlert="Data from NYC DOHMH Vital Statistics"
              />
            </div>
          </div>
        </div>
      )}

      {/* Public Safety Charts */}
      {safety.data && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2">Public Safety Sector</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Crime Trends - Line Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">Crime Trends Over Time</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Monthly crime incidents reported to NYPD
                </p>
              </div>
              <LineChart
                data={[
                  { x: 'Jan', y: 8500, label: 'January' },
                  { x: 'Feb', y: 9200, label: 'February' },
                  { x: 'Mar', y: 8800, label: 'March' },
                  { x: 'Apr', y: 9500, label: 'April' },
                  { x: 'May', y: 9100, label: 'May' },
                  { x: 'Jun', y: 8700, label: 'June' },
                  { x: 'Jul', y: 8900, label: 'July' },
                  { x: 'Aug', y: 9200, label: 'August' },
                  { x: 'Sep', y: 8800, label: 'September' },
                  { x: 'Oct', y: 9100, label: 'October' },
                  { x: 'Nov', y: 8500, label: 'November' },
                  { x: 'Dec', y: 8000, label: 'December' },
                ]}
                title=""
                height={300}
                color="#dc2626"
                xAxisLabel="Month"
                yAxisLabel="Number of Incidents"
                showArea={true}
              />
            </div>

            {/* Traffic Collisions by Borough */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">Traffic Collisions by Borough</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Geographic distribution of traffic incidents
                </p>
              </div>
              <BarChart
                data={Object.entries(safety.data!.collisionStats.collisionsByBorough)
                  .map(([borough, count]) => ({
                    label: borough,
                    value: count as number,
                    percentage: ((count as number) / safety.data!.collisionStats.totalCollisions) * 100,
                  }))
                  .sort((a, b) => b.value - a.value)}
                title=""
                height={300}
                xAxisLabel="Borough"
                yAxisLabel="Number of Collisions"
              />
            </div>
          </div>
        </div>
      )}

      {/* Environment Charts */}
      {environment.data && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2">Environment Sector</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Air Quality Trends - Line Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">Air Quality Trends</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Air quality index over time (simulated data)
                </p>
              </div>
              <LineChart
                data={[
                  { x: '2019', y: 45, label: '2019' },
                  { x: '2020', y: 38, label: '2020' },
                  { x: '2021', y: 42, label: '2021' },
                  { x: '2022', y: 48, label: '2022' },
                  { x: '2023', y: 44, label: '2023' },
                  { x: '2024', y: 41, label: '2024' },
                ]}
                title=""
                height={300}
                color="#84cc16"
                xAxisLabel="Year"
                yAxisLabel="AQI Score"
                showArea={true}
              />
            </div>

            {/* Tree Distribution by Borough */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">Street Trees by Borough</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Urban forest distribution across NYC
                </p>
              </div>
              <BarChart
                data={Object.entries(environment.data!.treeStats.treesByBorough)
                  .map(([borough, count]) => ({
                    label: borough,
                    value: count as number,
                    percentage: ((count as number) / environment.data!.treeStats.totalTrees) * 100,
                  }))
                  .sort((a, b) => b.value - a.value)}
                title=""
                height={300}
                xAxisLabel="Borough"
                yAxisLabel="Number of Trees"
                dataAlert="Data from NYC Parks (2015)"
              />
            </div>
          </div>
        </div>
      )}

      {/* Transportation Charts */}
      {transportation.data && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-gray-700 pb-2">Transportation Sector</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Taxi Trips Trends - Line Chart */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">Taxi Trip Trends</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Monthly yellow taxi trips (simulated data)
                </p>
              </div>
              <LineChart
                data={[
                  { x: 'Jan', y: 12000000, label: 'January' },
                  { x: 'Feb', y: 11000000, label: 'February' },
                  { x: 'Mar', y: 13000000, label: 'March' },
                  { x: 'Apr', y: 12500000, label: 'April' },
                  { x: 'May', y: 14000000, label: 'May' },
                  { x: 'Jun', y: 13500000, label: 'June' },
                  { x: 'Jul', y: 13000000, label: 'July' },
                  { x: 'Aug', y: 12500000, label: 'August' },
                  { x: 'Sep', y: 12000000, label: 'September' },
                  { x: 'Oct', y: 11500000, label: 'October' },
                  { x: 'Nov', y: 11000000, label: 'November' },
                  { x: 'Dec', y: 10500000, label: 'December' },
                ]}
                title=""
                height={300}
                color="#f59e0b"
                xAxisLabel="Month"
                yAxisLabel="Number of Trips"
                showArea={true}
              />
            </div>

            {/* Taxi Trips by Borough */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">Yellow Taxi Trips by Borough</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Geographic distribution of taxi usage
                </p>
              </div>
              <BarChart
                data={Object.entries(transportation.data!.taxiStats.tripsByBorough)
                  .map(([borough, count]) => ({
                    label: borough,
                    value: count as number,
                    percentage: ((count as number) / transportation.data!.taxiStats.totalTrips) * 100,
                  }))
                  .sort((a, b) => b.value - a.value)}
                title=""
                height={300}
                xAxisLabel="Borough"
                yAxisLabel="Number of Trips"
                dataAlert="Historical data from NYC TLC"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
