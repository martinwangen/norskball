/**
 * Utility functions for generating placeholder images
 */

/**
 * Generate a placeholder image URL for a player or person
 * @param name The name to display on the placeholder
 * @param size The size of the image in pixels
 * @returns A URL to a placeholder image
 */
export function getPersonPlaceholder(name: string, size: number = 60): string {
  const text = name ? name.charAt(0).toUpperCase() : 'P';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&background=random&size=${size}`;
}

/**
 * Generate a placeholder image URL for a team
 * @param name The team name to display on the placeholder
 * @param size The size of the image in pixels
 * @returns A URL to a placeholder image
 */
export function getTeamPlaceholder(name: string, size: number = 60): string {
  const text = name ? name.charAt(0).toUpperCase() : 'T';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&background=random&size=${size}`;
}

/**
 * Generate a generic placeholder image URL
 * @param text The text to display on the placeholder
 * @param size The size of the image in pixels
 * @returns A URL to a placeholder image
 */
export function getPlaceholder(text: string, size: number = 60): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&background=random&size=${size}`;
}
