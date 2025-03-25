import { useMutation } from '@vue/apollo-composable';
import { useMatchesStore } from '../stores/matches';
import type { RatingInput } from '../gql/__generated__/graphql';
import { ADD_RATING, ADD_SIMPLE_RATING } from '../gql/mutations/rating';
import { ref } from 'vue';

export const ratingService = {
  // State management
  isRating: ref(false),
  temporaryRatings: ref<Record<string, number>>({}),

  // Rating mode management
  startRatingMode(lineupPlayers: Array<{ playerId: string; position: string }>) {
    console.log('Starting rating mode');
    this.isRating.value = true;
    this.temporaryRatings.value = {};

    // Set default ratings for starting players (5) and substitutes (0)
    lineupPlayers.forEach(player => {
      if (player.playerId) {
        const positionNumber = parseInt(player.position);
        const isStarter = positionNumber <= 11;
        console.log('Initializing rating for player:', player.playerId, 'is starter:', isStarter);
        this.temporaryRatings.value[player.playerId] = isStarter ? 5 : 0;
      }
    });
    console.log('Initial temporary ratings:', this.temporaryRatings.value);
  },

  stopRatingMode() {
    console.log('Stopping rating mode');
    this.isRating.value = false;
    this.temporaryRatings.value = {};
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
    if (this.isRating.value) {
      this.temporaryRatings.value[playerId] = rating;
      console.log('Temporary ratings after update:', this.temporaryRatings.value);
    } else {
      await this.savePlayerRating(playerId, rating);
    }
  },

  async saveAllRatings() {
    try {
      console.log('Starting to save ratings. Current temporary ratings:', this.temporaryRatings.value);
      // Save all temporary ratings
      for (const [playerId, rating] of Object.entries(this.temporaryRatings.value)) {
        console.log('Saving rating for player:', playerId, 'rating:', rating);
        await this.savePlayerRating(playerId, rating);
      }
      // Clear temporary ratings and exit rating mode
      this.temporaryRatings.value = {};
      this.isRating.value = false;
    } catch (error) {
      console.error('Error saving ratings:', error);
      throw error;
    }
  },

  async removePlayerRating(playerId: string) {
    console.log('Removing rating for player:', playerId);
    if (this.isRating.value) {
      this.temporaryRatings.value[playerId] = 0;
      console.log('Temporary ratings after removal:', this.temporaryRatings.value);
    } else {
      await this.savePlayerRating(playerId, 0);
    }
  },

  getPlayerRating(playerId: string, lineupPlayers: Array<{ playerId: string; averageRating?: number | null }>): number {
    if (this.isRating.value) {
      return this.temporaryRatings.value[playerId] || 5;
    }
    const matchPlayer = lineupPlayers.find(p => p.playerId === playerId);
    const rating = matchPlayer?.averageRating || 5;
    console.log('Getting stored rating for player:', playerId, 'rating:', rating);
    return rating;
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
        console.log('Adding simple rating for player:', matchPlayerId, 'score:', score);
        const result = await addSimpleRating({

            matchPlayerId: matchPlayerId,
            score: score

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
    if (rating >= 9) return 'positive-10';
    if (rating >= 8) return 'positive-8';
    if (rating >= 7) return 'positive-6';
    if (rating >= 6) return 'warning-8';
    if (rating >= 5) return 'warning-6';
    if (rating >= 4) return 'negative-8';
    if (rating >= 3) return 'negative-10';
    return 'negative-14';
  }
};
