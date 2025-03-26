using HotChocolate.Authorization;
using Norskball.Data;
using Norskball.GraphQL.Base;
using Norskball.Models;
using Serilog;

namespace Norskball.GraphQL.Mutations
{
    [GraphQLDescription("Represents the available Team mutations.")]
    [ExtendObjectType(typeof(Mutation))]
    public class TeamMutations
    {
        public async Task<Team> AddTeamAsync(NorskballDbContext dbContext, Team team)
        {
            dbContext.Teams.Add(team);
            await dbContext.SaveChangesAsync();
            return team;
        }

        [Authorize(Roles = new[] {"admin"})]
        public async Task<Team> UpdateTeamAsync(NorskballDbContext dbContext, Team team)
        {
            dbContext.Teams.Update(team);
            await dbContext.SaveChangesAsync();
            return team;
        }

        [Authorize(Roles = new[] {"admin"})]
        public async Task<Team> DeleteTeamAsync(NorskballDbContext dbContext, string id)
        {
            var team = await dbContext.Teams.FindAsync(id);

            if (team == null)
                throw new Exception($"Could not find the specified {nameof(team)} with ID {id} to delete; was it already deleted?");

            dbContext.Teams.Remove(team);
            await dbContext.SaveChangesAsync();
            return team;
        }
    }
} 