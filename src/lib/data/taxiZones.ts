/**
 * NYC Taxi Zone ID to Location Name Mapping
 * Source: NYC TLC Taxi Zone Lookup Table
 */
export const TAXI_ZONES: Record<string, { name: string; borough: string }> = {
  '1': { name: 'Newark Airport', borough: 'EWR' },
  '2': { name: 'Jamaica Bay', borough: 'Queens' },
  '4': { name: 'Alphabet City', borough: 'Manhattan' },
  '12': { name: 'Annadale-Huguenot-Prince\'s Bay', borough: 'Staten Island' },
  '13': { name: 'Arden Heights', borough: 'Staten Island' },
  '24': { name: 'Battery Park', borough: 'Manhattan' },
  '41': { name: 'Central Harlem', borough: 'Manhattan' },
  '42': { name: 'Central Harlem North', borough: 'Manhattan' },
  '43': { name: 'Central Park', borough: 'Manhattan' },
  '45': { name: 'Chinatown', borough: 'Manhattan' },
  '48': { name: 'Clinton East', borough: 'Manhattan' },
  '50': { name: 'Clinton West', borough: 'Manhattan' },
  '68': { name: 'East Chelsea', borough: 'Manhattan' },
  '74': { name: 'East Harlem North', borough: 'Manhattan' },
  '75': { name: 'East Harlem South', borough: 'Manhattan' },
  '79': { name: 'East Village', borough: 'Manhattan' },
  '87': { name: 'Financial District North', borough: 'Manhattan' },
  '88': { name: 'Financial District South', borough: 'Manhattan' },
  '90': { name: 'Flatiron', borough: 'Manhattan' },
  '100': { name: 'Garment District', borough: 'Manhattan' },
  '103': { name: 'Governors Island', borough: 'Manhattan' },
  '104': { name: 'Gramercy', borough: 'Manhattan' },
  '105': { name: 'Gravesend', borough: 'Brooklyn' },
  '107': { name: 'Greenwich Village North', borough: 'Manhattan' },
  '113': { name: 'Greenwich Village South', borough: 'Manhattan' },
  '114': { name: 'Hamilton Heights', borough: 'Manhattan' },
  '116': { name: 'Highbridge Park', borough: 'Manhattan' },
  '120': { name: 'Hudson Sq', borough: 'Manhattan' },
  '125': { name: 'Inwood', borough: 'Manhattan' },
  '127': { name: 'JFK Airport', borough: 'Queens' },
  '128': { name: 'Kensington', borough: 'Brooklyn' },
  '132': { name: 'LaGuardia Airport', borough: 'Queens' },
  '137': { name: 'Lenox Hill East', borough: 'Manhattan' },
  '138': { name: 'Lenox Hill West', borough: 'Manhattan' },
  '140': { name: 'Lincoln Square East', borough: 'Manhattan' },
  '141': { name: 'Lincoln Square West', borough: 'Manhattan' },
  '142': { name: 'Little Italy/NoLiTa', borough: 'Manhattan' },
  '143': { name: 'Long Island City', borough: 'Queens' },
  '144': { name: 'Lower East Side', borough: 'Manhattan' },
  '148': { name: 'Manhattanville', borough: 'Manhattan' },
  '151': { name: 'Marble Hill', borough: 'Manhattan' },
  '152': { name: 'Marine Park', borough: 'Brooklyn' },
  '153': { name: 'Meatpacking', borough: 'Manhattan' },
  '158': { name: 'Midtown Center', borough: 'Manhattan' },
  '161': { name: 'Midtown East', borough: 'Manhattan' },
  '162': { name: 'Midtown North', borough: 'Manhattan' },
  '163': { name: 'Midtown South', borough: 'Manhattan' },
  '164': { name: 'Midtown West', borough: 'Manhattan' },
  '166': { name: 'Morningside Heights', borough: 'Manhattan' },
  '170': { name: 'Murray Hill', borough: 'Manhattan' },
  '186': { name: 'Penn Station', borough: 'Manhattan' },
  '194': { name: 'Prospect Heights', borough: 'Brooklyn' },
  '202': { name: 'Queensboro Hill', borough: 'Queens' },
  '209': { name: 'Riverdale', borough: 'Bronx' },
  '211': { name: 'Roosevelt Island', borough: 'Manhattan' },
  '224': { name: 'Soho', borough: 'Manhattan' },
  '229': { name: 'Steinway', borough: 'Queens' },
  '230': { name: 'Stuy Town', borough: 'Manhattan' },
  '231': { name: 'Sutton Place', borough: 'Manhattan' },
  '232': { name: 'Times Sq', borough: 'Manhattan' },
  '233': { name: 'Tribeca', borough: 'Manhattan' },
  '234': { name: 'Union Sq', borough: 'Manhattan' },
  '236': { name: 'Upper East Side North', borough: 'Manhattan' },
  '237': { name: 'Upper East Side South', borough: 'Manhattan' },
  '238': { name: 'Upper West Side North', borough: 'Manhattan' },
  '239': { name: 'Upper West Side South', borough: 'Manhattan' },
  '243': { name: 'Washington Heights North', borough: 'Manhattan' },
  '244': { name: 'Washington Heights South', borough: 'Manhattan' },
  '246': { name: 'West Chelsea', borough: 'Manhattan' },
  '249': { name: 'West Village', borough: 'Manhattan' },
  '261': { name: 'Williamsburg North', borough: 'Brooklyn' },
  '262': { name: 'Williamsburg South', borough: 'Brooklyn' },
  '263': { name: 'Yorkville East', borough: 'Manhattan' },
  '264': { name: 'Yorkville West', borough: 'Manhattan' },
};

export function getZoneName(zoneId: string): string {
  const zone = TAXI_ZONES[zoneId];
  return zone ? zone.name : `Zone ${zoneId}`;
}

export function getZoneBorough(zoneId: string): string {
  const zone = TAXI_ZONES[zoneId];
  return zone ? zone.borough : 'Unknown';
}

export function getZoneFullName(zoneId: string): string {
  const zone = TAXI_ZONES[zoneId];
  return zone ? `${zone.name} (${zone.borough})` : `Zone ${zoneId}`;
}

