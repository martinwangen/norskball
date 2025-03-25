/**
 * Navigation utility functions
 */
import type { Router } from 'vue-router';

/**
 * Navigate to a team's detail page
 * @param router Vue Router instance
 * @param team_id The ID of the team to navigate to
 */
export function navigateToTeam(router: Router, team_id: number | string): void {
  void router.push(`/teams/${team_id}`);
}

export default {
  navigateToTeam
};
