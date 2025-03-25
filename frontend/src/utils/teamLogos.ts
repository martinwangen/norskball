/**
 * Maps team names to their corresponding logo files in the public/eliteserien directory
 * Bodø/Glimt
Brann
Bryne
Fredrikstad
HamKam
Haugesund
KFUM
Kristiansund
Molde
Rosenborg
Sandefjord Fotball
Sarpsborg 08
Strømsgodset
Tromsø
Viking
Vålerenga

 */

// Map of team names to their logo files
const teamLogoMap: Record<string, string> = {
  'Bodø/Glimt': 'eliteserien/Bodø Glimt.png',
  'Brann': 'eliteserien/Brann.png',
  'Bryne': 'eliteserien/Bryne.png',
  'Fredrikstad': 'eliteserien/Fredrikstad.png',
  'HamKam': 'eliteserien/HamKam.png',
  'Haugesund': 'eliteserien/Haugesund.png',
  'Kristiansund': 'eliteserien/KBK.png',
  'KFUM': 'eliteserien/KFUM.png',
  'Molde': 'eliteserien/Molde.png',
  'Rosenborg': 'eliteserien/RBK.png',
  'Sarpsborg 08': 'eliteserien/SARPSBORG_08_CMYK.jpg',
  'Sandefjord Fotball': 'eliteserien/Sandefjord.png',
  'Strømsgodset': 'eliteserien/Strømsgodset.png',
  'Tromsø': 'eliteserien/Tromsø.png',
  'Vålerenga': 'eliteserien/Vålerenga.png',
  'Viking': 'eliteserien/Viking.png',
};

/**
 * Gets the logo URL for a team
 * @param team_name The name of the team
 * @param existingLogoUrl The existing logo URL (if any)
 * @param fallbackSize The size of the fallback placeholder image
 * @returns The logo URL
 */
export function getTeamLogoUrl(team_name: string, existingLogoUrl?: string, fallbackSize = 60): string {
  // First check if the team already has a logo URL
  if (existingLogoUrl && !existingLogoUrl.includes('example.com')) {
    return existingLogoUrl;
  }

  // Try to find a match for the team name
  if (team_name in teamLogoMap) {
    console.log('teamLogoMap[team_name]', teamLogoMap[team_name]);
    return teamLogoMap[team_name];
  }

  // Try to find a partial match
  for (const [key, value] of Object.entries(teamLogoMap)) {
    if (team_name.includes(key) || key.includes(team_name)) {
      return value;
    }
  }

  // Fallback to a placeholder with the team's initial
  return `https://via.placeholder.com/${fallbackSize}?text=${team_name.charAt(0)}`;
}

export default getTeamLogoUrl;
