import { useMutation } from '@vue/apollo-composable';
import { useMatchesStore } from '../stores/matches';
import type { RatingInput } from '../gql/__generated__/graphql';
import { ADD_RATING, ADD_SIMPLE_RATING } from '../gql/mutations/rating';
import { ref } from 'vue';

export const ratingService = {
  // State management
  isRating: ref(false),

  // Rating mode management
  async startRatingMode(lineupPlayers: Array<{ playerId: string; position: string }>) {
    console.log('Starting rating mode');
    this.isRating.value = true;

    // Set default rating of 5 for all starting players
    const startingPlayers = lineupPlayers.filter(player => {
      if (!player.playerId) return false;
      const positionNumber = parseInt(player.position);
      return positionNumber <= 11; // Starting players are positions 1-11
    });

    // Set default ratings for all starting players
    await Promise.all(startingPlayers.map(async (player) => {
      try {
        console.log('Setting default rating for starting player:', player.playerId);
        await this.savePlayerRating(player.playerId, 5);
      } catch (error) {
        console.error('Error setting default rating for player:', player.playerId, error);
      }
    }));
  },

  stopRatingMode() {
    console.log('Stopping rating mode');
    this.isRating.value = false;
  },

  // Rating operations
  async savePlayerRating(playerId: string, rating: number) {
    try {
      console.log('Saving rating for player:', playerId, 'rating:', rating);
      await this.useAddSimpleRating().addSimpleRating(playerId, rating);
    } catch (error) {
      console.error('Error updating player rating:', error);
      throw error;
    }
  },

  async updatePlayerRating(playerId: string, rating: number) {
    console.log('Updating rating for player:', playerId, 'rating:', rating);
    await this.savePlayerRating(playerId, rating);
  },

  async removePlayerRating(playerId: string) {
    console.log('Removing rating for player:', playerId);
    await this.savePlayerRating(playerId, 0);
  },

  getPlayerRating(playerId: string, lineupPlayers: Array<{ playerId: string; averageRating?: number | null; ratings?: Array<{ userId: string; score: number }> }>): number {
    const matchPlayer = lineupPlayers.find(p => p.playerId === playerId);
    if (!matchPlayer) return 0;

    return matchPlayer.ratings[matchPlayer.ratings.length - 1].score;

    // Fallback to average rating or 0
    return matchPlayer.averageRating || 0;
  },

  // Existing mutation hooks
  useAddRating() {
    const { mutate: addRating, loading, error } = useMutation(ADD_RATING);
    const matchStore = useMatchesStore();

    const execute = async (input: RatingInput) => {
      try {
        console.log('Adding rating with input:', input);
        const result = await addRating({ input });
        console.log('Rating result:', result);

        if (result?.data?.addRating) {
          // Update the match in the store
          const matchIndex = matchStore.matches.findIndex(m =>
            m.homeTeamLineup?.players.some(p => p.id === input.matchPlayerId) ||
            m.awayTeamLineup?.players.some(p => p.id === input.matchPlayerId)
          );

          if (matchIndex !== -1) {
            const match = matchStore.matches[matchIndex];
            // Update player in both home and away team lineups if they exist
            if (match.homeTeamLineup) {
              const homePlayerIndex = match.homeTeamLineup.players.findIndex(p => p.id === input.matchPlayerId);
              if (homePlayerIndex !== -1) {
                if (!match.homeTeamLineup.players[homePlayerIndex].ratings) {
                  match.homeTeamLineup.players[homePlayerIndex].ratings = [];
                }
                match.homeTeamLineup.players[homePlayerIndex].ratings.push(result.data.addRating);
              }
            }
            if (match.awayTeamLineup) {
              const awayPlayerIndex = match.awayTeamLineup.players.findIndex(p => p.id === input.matchPlayerId);
              if (awayPlayerIndex !== -1) {
                if (!match.awayTeamLineup.players[awayPlayerIndex].ratings) {
                  match.awayTeamLineup.players[awayPlayerIndex].ratings = [];
                }
                match.awayTeamLineup.players[awayPlayerIndex].ratings.push(result.data.addRating);
              }
            }
          }
        }
        return result?.data?.addRating;
      } catch (err) {
        console.error('Error adding rating:', err);
        throw err;
      }
    };

    return {
      addRating: execute,
      loading,
      error
    };
  },

  useAddSimpleRating() {
    const { mutate: addSimpleRating, loading, error } = useMutation(ADD_SIMPLE_RATING);
    const matchStore = useMatchesStore();

    const execute = async (matchPlayerId: string, score: number) => {
      try {
        const result = await addSimpleRating({
          matchPlayerId,
          score
        });

        if (result?.data?.addSimpleRating) {
          // Update the match in the store
          const matchIndex = matchStore.matches.findIndex(m =>
            m.homeTeamLineup?.players.some(p => p.id === matchPlayerId) ||
            m.awayTeamLineup?.players.some(p => p.id === matchPlayerId)
          );

          if (matchIndex !== -1) {
            const match = matchStore.matches[matchIndex];
            // Update player in both home and away team lineups if they exist
            if (match.homeTeamLineup) {
              const homePlayerIndex = match.homeTeamLineup.players.findIndex(p => p.id === matchPlayerId);
              if (homePlayerIndex !== -1) {
                if (!match.homeTeamLineup.players[homePlayerIndex].ratings) {
                  match.homeTeamLineup.players[homePlayerIndex].ratings = [];
                }
                match.homeTeamLineup.players[homePlayerIndex].ratings.push(result.data.addSimpleRating);
              }
            }
            if (match.awayTeamLineup) {
              const awayPlayerIndex = match.awayTeamLineup.players.findIndex(p => p.id === matchPlayerId);
              if (awayPlayerIndex !== -1) {
                if (!match.awayTeamLineup.players[awayPlayerIndex].ratings) {
                  match.awayTeamLineup.players[awayPlayerIndex].ratings = [];
                }
                match.awayTeamLineup.players[awayPlayerIndex].ratings.push(result.data.addSimpleRating);
              }
            }
          }
        }
        return result?.data?.addSimpleRating;
      } catch (err) {
        console.error('Error adding simple rating:', err);
        throw err;
      }
    };

    return {
      addSimpleRating: execute,
      loading,
      error
    };
  },

  // Helper function to get rating color based on score
  getRatingColor(rating: number): string {
    if (rating >= 9) return 'positive';
    if (rating >= 8) return 'positive';
    if (rating >= 7) return 'positive';
    if (rating >= 6) return 'warning';
    if (rating >= 5) return 'warning';
    if (rating >= 4) return 'negative';
    if (rating >= 3) return 'negative';
    return 'negative';
  }
};
